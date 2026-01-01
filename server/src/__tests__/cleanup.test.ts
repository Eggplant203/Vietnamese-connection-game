import { cleanupService } from '../services/cleanupService';

// Mock database query
jest.mock('../db', () => ({
  query: jest.fn(),
}));

const { query } = require('../db');

describe('Cleanup Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('deleteUnpopularPuzzles', () => {
    test('should delete puzzles with rating < -10', async () => {
      query.mockResolvedValue({ rows: [{ id: '1' }, { id: '2' }], rowCount: 2 });

      const deletedCount = await cleanupService.deleteUnpopularPuzzles();

      expect(query).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM puzzles')
      );
      expect(query).toHaveBeenCalledWith(
        expect.stringContaining('rating < -10')
      );
      expect(deletedCount).toBe(2);
    });

    test('should return 0 when no puzzles deleted', async () => {
      query.mockResolvedValue({ rows: [], rowCount: 0 });

      const deletedCount = await cleanupService.deleteUnpopularPuzzles();

      expect(deletedCount).toBe(0);
    });

    test('should handle database errors', async () => {
      query.mockRejectedValue(new Error('Database error'));

      await expect(cleanupService.deleteUnpopularPuzzles()).rejects.toThrow('Database error');
    });
  });

  describe('deleteUnverifiedPuzzles', () => {
    test('should delete unverified puzzles older than 24h', async () => {
      query.mockResolvedValue({ rows: [{ id: '3' }, { id: '4' }, { id: '5' }], rowCount: 3 });

      const deletedCount = await cleanupService.deleteUnverifiedPuzzles();

      expect(query).toHaveBeenCalledWith(
        expect.stringContaining('verified = FALSE')
      );
      expect(query).toHaveBeenCalledWith(
        expect.stringContaining('24 hours')
      );
      expect(deletedCount).toBe(3);
    });

    test('should return 0 when no unverified puzzles to delete', async () => {
      query.mockResolvedValue({ rows: [], rowCount: 0 });

      const deletedCount = await cleanupService.deleteUnverifiedPuzzles();

      expect(deletedCount).toBe(0);
    });

    test('should only target unverified puzzles', async () => {
      query.mockResolvedValue({ rows: [{ id: '1' }], rowCount: 1 });

      await cleanupService.deleteUnverifiedPuzzles();

      expect(query).toHaveBeenCalledWith(
        expect.stringContaining('verified = FALSE')
      );
    });
  });
});
