import { Router } from 'express';
import { puzzleService } from '../puzzle/puzzleService';
import { AdminPuzzleUpload, APIResponse, Group } from '../shared/Types';
import { v4 as uuidv4 } from 'uuid';

export const adminRouter = Router();

// Upload new puzzle to database
adminRouter.post('/upload', async (req, res) => {
  try {
    const upload: AdminPuzzleUpload = req.body;

    // Validate
    if (!upload.gameName || !upload.overallDifficulty || !upload.groups || upload.groups.length !== 4) {
      return res.status(400).json({
        success: false,
        error: 'Invalid puzzle data. Need gameName, overallDifficulty, and 4 groups'
      } as APIResponse);
    }

    // Transform to Puzzle format
    const colorMap = ['green', 'yellow', 'purple', 'red'] as const;
    const difficultyMap = ['easy', 'medium', 'hard', 'expert'] as const;

    const groups: Group[] = upload.groups.map((g, index) => ({
      id: uuidv4(),
      theme: g.theme,
      words: g.words.split(',').map(w => ({
        id: uuidv4(),
        text: w.trim().toLowerCase()
      })),
      color: colorMap[index],
      difficulty: difficultyMap[index]
    }));

    // Validate word count
    for (const group of groups) {
      if (group.words.length !== 4) {
        return res.status(400).json({
          success: false,
          error: `Group "${group.theme}" must have exactly 4 words (comma separated)`
        } as APIResponse);
      }
    }

    const puzzle = {
      id: uuidv4(),
      gameName: upload.gameName,
      overallDifficulty: upload.overallDifficulty,
      groups,
      createdAt: new Date(),
      isDaily: false
    };

    const saved = await puzzleService.savePuzzle(puzzle);

    res.json({
      success: true,
      data: saved,
      message: 'Puzzle uploaded successfully!'
    } as APIResponse);
  } catch (error) {
    console.error('Error uploading puzzle:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload puzzle'
    } as APIResponse);
  }
});

// Get all puzzles for admin
adminRouter.get('/puzzles', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const puzzles = await puzzleService.getAllPuzzles(limit);

    res.json({
      success: true,
      data: puzzles
    } as APIResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get puzzles'
    } as APIResponse);
  }
});

// Delete puzzle
adminRouter.delete('/puzzles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await puzzleService.deletePuzzle(id);

    res.json({
      success: true,
      message: 'Puzzle deleted successfully'
    } as APIResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete puzzle'
    } as APIResponse);
  }
});
