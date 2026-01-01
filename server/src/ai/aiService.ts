import { GoogleGenAI } from '@google/genai';
import { Puzzle, Group, OverallDifficulty, GroupColor, AIGenerateRequest } from '../shared/Types';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

// Load all available API keys from environment
const API_KEYS = [
  process.env.GEMINI_API_KEY,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3,
  process.env.GEMINI_API_KEY_4,
  process.env.GEMINI_API_KEY_5
].filter(key => key) as string[];

if (API_KEYS.length === 0) {
  console.error('❌ No GEMINI_API_KEY found in server/.env');
}

const colorMap: Record<number, GroupColor> = {
  0: 'green',
  1: 'yellow',
  2: 'purple',
  3: 'red'
};

const groupDifficultyMap: Record<number, 'easy' | 'medium' | 'hard' | 'expert'> = {
  0: 'easy',
  1: 'medium',
  2: 'hard',
  3: 'expert'
};

export class AIService {
  private currentKeyIndex = 0;

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get next API key from the pool
   * Returns null when all keys are exhausted
   */
  private getNextKey(): string | null {
    if (this.currentKeyIndex >= API_KEYS.length) {
      return null;
    }
    const key = API_KEYS[this.currentKeyIndex];
    this.currentKeyIndex++;
    return key;
  }

  private resetKeyIndex(): void {
    this.currentKeyIndex = 0;
  }

  /**
   * Generate a puzzle using Google Gemini AI
   * Automatically tries multiple API keys if quota is exceeded
   * @param request - Optional theme for puzzle generation
   * @returns Generated puzzle with 4 groups of 4 words
   */
  async generatePuzzle(request: AIGenerateRequest): Promise<Puzzle> {
    const { theme } = request;

    const difficulties: OverallDifficulty[] = ['easy', 'medium', 'hard', 'brain-teaser'];
    const overallDifficulty = difficulties[Math.floor(Math.random() * difficulties.length)];

    const prompt = `
You are designing a Vietnamese-language edition of the NYT Connections puzzle.

Generate ONE 16-word puzzle divided into 4 groups of 4.

The puzzle language must be Vietnamese.
The topic scope is UNRESTRICTED (science, internet, brands, slang, pop culture, math, technology, etc).
Do NOT bias toward Vietnam culture unless required by theme.

The puzzle MUST be designed for MISDIRECTION:
• Many words should appear to belong to multiple groups
• At least two groups must share semantic overlap to create traps

Difficulty tiers must be strictly enforced:

GREEN  - obvious, concrete, everyday category
YELLOW - conceptual category, not directly visible
PURPLE - abstract, linguistic, metaphorical, or pattern-based category
RED    - wordplay, hidden structure, homonym, acronym, letter-logic, multi-meaning, etc

Overall difficulty must reflect how deceptive the full 16-word set is.

${theme ? `Optional inspiration (NOT restriction): ${theme}` : ''}

Rules:
• 16 words must be unique
• Use Vietnamese vocabulary (loanwords allowed)
• Proper nouns: capitalize. Others lowercase.
• Avoid local-culture bias unless it improves misdirection
• Do NOT explain anything

Return ONLY this JSON:

{
  "gameName": "short catchy name",
  "overallDifficulty": "easy | medium | hard | brain-teaser",
  "groups": [
    { "color":"green",  "theme":"...", "words":[...4] },
    { "color":"yellow", "theme":"...", "words":[...4] },
    { "color":"purple", "theme":"...", "words":[...4] },
    { "color":"red",    "theme":"...", "words":[...4] }
  ]
}
`;

    this.resetKeyIndex();
    let lastError: any = null;

    // Try each API key until one works
    while (true) {
      const apiKey = this.getNextKey();
      
      if (!apiKey) {
        // All keys exhausted
        throw new Error(`All Gemini API keys exhausted. Last error: ${lastError?.message || 'Unknown error'}`);
      }

      try {
        const ai = new GoogleGenAI({ apiKey });
        const res = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt
        });

        const text = res.text || '';
        const match = text.match(/\{[\s\S]*\}/);
        if (!match) throw new Error('No JSON from AI');

        const parsed = JSON.parse(match[0]);

        const groups: Group[] = parsed.groups.map((g: any, index: number) => ({
          id: uuidv4(),
          theme: g.theme,
          color: colorMap[index],
          difficulty: groupDifficultyMap[index],
          words: g.words.map((w: string) => ({
            id: uuidv4(),
            text: w.trim()
          }))
        }));

        const allWords = groups.flatMap(g => g.words.map(w => w.text));
        if (new Set(allWords).size !== 16) throw new Error('Duplicate words detected');

        return {
          id: uuidv4(),
          gameName: parsed.gameName,
          overallDifficulty: parsed.overallDifficulty || overallDifficulty,
          groups,
          createdAt: new Date()
        };
      } catch (error: any) {
        lastError = error;
        
        // Check for quota errors (Gemini API wraps errors in error.error)
        const isQuotaError = 
          error.status === 429 || 
          error.status === 'RESOURCE_EXHAUSTED' ||
          error.error?.code === 429 ||
          error.error?.status === 'RESOURCE_EXHAUSTED';
        
        if (isQuotaError) {
          console.log(`⚠️ API key ${this.currentKeyIndex}/${API_KEYS.length} quota exceeded, trying next key...`);
          continue;
        }
        
        // For other errors, throw immediately
        throw error;
      }
    }
  }

  async generateRandomPuzzle(): Promise<Puzzle> {
    return this.generatePuzzle({});
  }

  async validatePuzzle(puzzle: Puzzle): Promise<boolean> {
    const words = puzzle.groups.flatMap(g => g.words.map(w => w.text));
    return puzzle.groups.length === 4 && new Set(words).size === 16;
  }
}

export const aiService = new AIService();
