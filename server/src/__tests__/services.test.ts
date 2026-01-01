import { aiService } from '../ai/aiService';
import { puzzleService } from '../puzzle/puzzleService';
import { Puzzle, Group } from '../../../shared/Types';

describe('AI Service', () => {
  // Skip AI tests if no API key available or quota exceeded
  // These tests require actual Gemini API calls
  test.skip('should generate valid puzzle', async () => {
    const puzzle = await aiService.generatePuzzle({ theme: 'Động vật' });
    
    expect(puzzle).toBeDefined();
    expect(puzzle.groups).toHaveLength(4);
    expect(puzzle.overallDifficulty).toBeDefined();
    
    puzzle.groups.forEach((group) => {
      expect(group.words).toHaveLength(4);
      expect(group.theme).toBeDefined();
      expect(group.color).toBeDefined();
      expect(group.difficulty).toBeDefined();
    });
  }, 30000);

  test.skip('should generate puzzle without theme', async () => {
    const puzzle = await aiService.generatePuzzle({});
    
    expect(puzzle).toBeDefined();
    expect(puzzle.groups).toHaveLength(4);
    expect(puzzle.id).toBeDefined();
  }, 30000);

  test.skip('should validate puzzle structure', async () => {
    const puzzle = await aiService.generatePuzzle({});
    const isValid = await aiService.validatePuzzle(puzzle);
    
    expect(isValid).toBe(true);
  }, 30000);
});

describe('Puzzle Service', () => {
  const mockPuzzle: Puzzle = {
    id: 'test-123',
    gameName: 'Test Puzzle',
    overallDifficulty: 'medium',
    groups: [
      {
        id: '1',
        theme: 'Số đếm tiếng Việt',
        words: [
          { id: '1', text: 'một' },
          { id: '2', text: 'hai' },
          { id: '3', text: 'ba' },
          { id: '4', text: 'bốn' },
        ],
        color: 'green',
        difficulty: 'easy',
      },
      {
        id: '2',
        theme: 'Màu sắc',
        words: [
          { id: '5', text: 'đỏ' },
          { id: '6', text: 'xanh' },
          { id: '7', text: 'vàng' },
          { id: '8', text: 'tím' },
        ],
        color: 'yellow',
        difficulty: 'medium',
      },
    ],
    createdAt: new Date(),
    createdBy: 'TEST',
  };

  describe('checkGuess', () => {
    test('should correctly check valid guess', () => {
      const result = puzzleService.checkGuess(mockPuzzle, ['một', 'hai', 'ba', 'bốn']);
      
      expect(result.success).toBe(true);
      expect(result.group).toBeDefined();
      expect(result.group?.theme).toBe('Số đếm tiếng Việt');
    });

    test('should handle case-insensitive matching', () => {
      const result = puzzleService.checkGuess(mockPuzzle, ['MỘT', 'HAI', 'BA', 'BỐN']);
      
      expect(result.success).toBe(true);
      expect(result.group).toBeDefined();
    });

    test('should handle words with extra spaces', () => {
      const result = puzzleService.checkGuess(mockPuzzle, ['  một  ', 'hai', 'ba', 'bốn']);
      
      expect(result.success).toBe(true);
      expect(result.group).toBeDefined();
    });

    test('should reject invalid guess', () => {
      const result = puzzleService.checkGuess(mockPuzzle, ['một', 'hai', 'năm', 'sáu']);
      
      expect(result.success).toBe(false);
      expect(result.group).toBeUndefined();
    });

    test('should reject guess with wrong number of words', () => {
      const result = puzzleService.checkGuess(mockPuzzle, ['một', 'hai', 'ba']);
      
      expect(result.success).toBe(false);
    });

    test('should reject guess with duplicate words', () => {
      const result = puzzleService.checkGuess(mockPuzzle, ['một', 'một', 'một', 'một']);
      
      expect(result.success).toBe(false);
    });

    test('should match second group', () => {
      const result = puzzleService.checkGuess(mockPuzzle, ['đỏ', 'xanh', 'vàng', 'tím']);
      
      expect(result.success).toBe(true);
      expect(result.group?.theme).toBe('Màu sắc');
      expect(result.group?.color).toBe('yellow');
    });
  });

  describe('calculateScore', () => {
    test('should calculate perfect score', () => {
      const score = puzzleService.calculateScore(1, 30000); // 1 attempt, 30 seconds
      
      expect(score).toBe(970); // 1000 - 0 penalty - 30 time penalty
    });

    test('should penalize multiple attempts', () => {
      const score1 = puzzleService.calculateScore(1, 60000);
      const score2 = puzzleService.calculateScore(2, 60000);
      const score3 = puzzleService.calculateScore(3, 60000);
      
      expect(score2).toBe(score1 - 200);
      expect(score3).toBe(score1 - 400);
    });

    test('should penalize longer completion time', () => {
      const score1 = puzzleService.calculateScore(1, 60000); // 60 seconds
      const score2 = puzzleService.calculateScore(1, 120000); // 120 seconds
      
      expect(score2).toBe(score1 - 60);
    });

    test('should have minimum score of 100', () => {
      const score = puzzleService.calculateScore(10, 999999);
      
      expect(score).toBe(100);
      expect(score).toBeGreaterThanOrEqual(100);
    });

    test('should handle 4 attempts correctly', () => {
      const score = puzzleService.calculateScore(4, 180000); // 4 attempts, 180 seconds
      
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThan(1000);
      // 1000 - (3 * 200) - 180 = 220
      expect(score).toBe(220);
    });
  });

  describe('score comparison', () => {
    test('faster time should give higher score', () => {
      const fastScore = puzzleService.calculateScore(1, 30000);
      const slowScore = puzzleService.calculateScore(1, 120000);
      
      expect(fastScore).toBeGreaterThan(slowScore);
    });

    test('fewer attempts should give higher score', () => {
      const score1 = puzzleService.calculateScore(1, 60000);
      const score4 = puzzleService.calculateScore(4, 60000);
      
      expect(score1).toBeGreaterThan(score4);
    });

    test('perfect game should give 1000 points (0 seconds)', () => {
      const score = puzzleService.calculateScore(1, 0);
      
      expect(score).toBe(1000);
    });
  });
});
