import { aiService } from '../ai/aiService';
import { puzzleService } from '../puzzle/puzzleService';

describe('AI Service', () => {
  test('should generate valid puzzle', async () => {
    const puzzle = await aiService.generatePuzzle({ theme: 'số đếm' });
    
    expect(puzzle).toBeDefined();
    expect(puzzle.groups).toHaveLength(4);
    
    puzzle.groups.forEach((group) => {
      expect(group.words).toHaveLength(4);
      expect(group.theme).toBeDefined();
      expect(group.color).toBeDefined();
    });
  }, 30000);

  test('should validate puzzle structure', async () => {
    const puzzle = await aiService.generatePuzzle({ theme: 'động vật' });
    const isValid = await aiService.validatePuzzle(puzzle);
    
    expect(isValid).toBe(true);
  }, 30000);
});

describe('Puzzle Service', () => {
  test('should correctly check valid guess', () => {
    const mockPuzzle = {
      id: 'test',
      overallDifficulty: 'easy' as const,
      groups: [
        {
          id: '1',
          theme: 'Test',
          words: [
            { id: '1', text: 'một' },
            { id: '2', text: 'hai' },
            { id: '3', text: 'ba' },
            { id: '4', text: 'bốn' },
          ],
          color: 'green' as const,
          difficulty: 'easy' as const,
        },
      ],
      createdAt: new Date(),
    };

    const result = puzzleService.checkGuess(mockPuzzle, ['một', 'hai', 'ba', 'bốn']);
    expect(result.success).toBe(true);
    expect(result.group).toBeDefined();
  });

  test('should reject invalid guess', () => {
    const mockPuzzle = {
      id: 'test',
      overallDifficulty: 'easy' as const,
      groups: [
        {
          id: '1',
          theme: 'Test',
          words: [
            { id: '1', text: 'một' },
            { id: '2', text: 'hai' },
            { id: '3', text: 'ba' },
            { id: '4', text: 'bốn' },
          ],
          color: 'green' as const,
          difficulty: 'easy' as const,
        },
      ],
      createdAt: new Date(),
    };

    const result = puzzleService.checkGuess(mockPuzzle, ['một', 'hai', 'năm', 'sáu']);
    expect(result.success).toBe(false);
  });

  test('should calculate score correctly', () => {
    const score1 = puzzleService.calculateScore(1, 60000); // 1 attempt, 60 seconds
    expect(score1).toBeGreaterThan(0);
    expect(score1).toBeLessThanOrEqual(1000);

    const score2 = puzzleService.calculateScore(4, 120000); // 4 attempts, 120 seconds
    expect(score2).toBeLessThan(score1);
  });
});
