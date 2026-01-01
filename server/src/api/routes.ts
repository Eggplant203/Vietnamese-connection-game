import { Router } from 'express';
import { aiService } from '../ai/aiService';
import { puzzleService } from '../puzzle/puzzleService';
import { userService } from '../auth/userService';
import { APIResponse, AttemptResult, AdminPuzzleUpload, Puzzle } from '../shared/Types';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';

export const apiRouter = Router();

// ============= ADMIN AUTH =============

// Admin login
apiRouter.post('/admin/login', async (req, res) => {
  try {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (password === adminPassword) {
      const token = jwt.sign(
        { role: 'admin' },
        process.env.JWT_SECRET || 'vn-connections-secret-key-2026',
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        token
      } as APIResponse);
    } else {
      res.status(401).json({
        success: false,
        error: 'Mật khẩu không đúng'
      } as APIResponse);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Lỗi xác thực'
    } as APIResponse);
  }
});

// ============= PUZZLE ROUTES =============

// Get puzzle from archive (database)
apiRouter.get('/archive', async (req, res) => {
  try {
    const puzzle = await puzzleService.getRandomPuzzle();
    
    if (!puzzle) {
      return res.status(404).json({
        success: false,
        error: 'Không có dữ liệu puzzle trong database. Vui lòng thêm puzzle từ trang Admin.'
      } as APIResponse);
    }

    const publicPuzzle = {
      ...puzzle,
      groups: puzzle.groups.map(g => ({
        id: g.id,
        theme: g.theme,
        words: g.words,
        color: g.color,
        difficulty: g.difficulty,
      }))
    };

    res.json({
      success: true,
      data: publicPuzzle
    } as APIResponse);
  } catch (error) {
    console.error('Error in /archive:', error);
    res.status(500).json({
      success: false,
      error: `Lỗi kết nối database: ${error instanceof Error ? error.message : 'Unknown error'}`
    } as APIResponse);
  }
});

// Generate random puzzle from AI
apiRouter.get('/random', async (req, res) => {
  try {
    const puzzle = await aiService.generateRandomPuzzle();
    
    // Save AI-generated puzzle to database with 'AI' as creator
    await puzzleService.savePuzzle(puzzle, 'AI');
    
    const publicPuzzle = {
      ...puzzle,
      groups: puzzle.groups.map(g => ({
        id: g.id,
        theme: g.theme,
        words: g.words,
        color: g.color,
        difficulty: g.difficulty,
      }))
    };

    res.json({
      success: true,
      data: publicPuzzle
    } as APIResponse);
  } catch (error) {
    console.error('Error in /random:', error);
    res.status(500).json({
      success: false,
      error: `Lỗi khi tạo puzzle từ AI: ${error instanceof Error ? error.message : 'Kiểm tra GEMINI_API_KEY trong file .env'}`
    } as APIResponse);
  }
});

// Submit guess
apiRouter.post('/submit', async (req, res) => {
  try {
    const { puzzleId, selectedWords, userId } = req.body;

    if (!puzzleId || !selectedWords || !Array.isArray(selectedWords)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request'
      } as APIResponse);
    }

    const puzzle = await puzzleService.getPuzzleById(puzzleId);
    if (!puzzle) {
      return res.status(404).json({
        success: false,
        error: 'Puzzle not found'
      } as APIResponse);
    }

    const result = puzzleService.checkGuess(puzzle, selectedWords);

    const response: AttemptResult = {
      success: result.success,
      group: result.group,
      message: result.success ? '🎉 Chính xác!' : '❌ Sai rồi, thử lại nhé!',
      remainingAttempts: 3 // This should be tracked per user
    };

    res.json({
      success: true,
      data: response
    } as APIResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit guess'
    } as APIResponse);
  }
});

// ============= AI ROUTES =============

// Generate new puzzle
apiRouter.post('/ai/generate', async (req, res) => {
  try {
    const { theme } = req.body;

    const puzzle = await aiService.generatePuzzle({ theme });
    const savedPuzzle = await puzzleService.savePuzzle(puzzle);

    res.json({
      success: true,
      data: savedPuzzle
    } as APIResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate puzzle'
    } as APIResponse);
  }
});

// ============= USER ROUTES =============

// Create or get user
apiRouter.post('/users', async (req, res) => {
  try {
    const { username, email } = req.body;

    if (!username) {
      return res.status(400).json({
        success: false,
        error: 'Username is required'
      } as APIResponse);
    }

    // Check if user exists
    let user = await userService.getUserByUsername(username);
    
    if (!user) {
      user = await userService.createUser(username, email);
    }

    res.json({
      success: true,
      data: user
    } as APIResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create user'
    } as APIResponse);
  }
});

// Get user by ID
apiRouter.get('/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userService.getUserById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      } as APIResponse);
    }

    res.json({
      success: true,
      data: user
    } as APIResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get user'
    } as APIResponse);
  }
});

// Rate puzzle
apiRouter.post('/rate', async (req, res) => {
  try {
    const { puzzleId, rating } = req.body;

    if (!puzzleId || typeof rating !== 'number') {
      return res.status(400).json({
        success: false,
        error: 'Invalid request'
      } as APIResponse);
    }

    // Only allow +1 or -1
    if (rating !== 1 && rating !== -1) {
      return res.status(400).json({
        success: false,
        error: 'Rating must be 1 or -1'
      } as APIResponse);
    }

    await puzzleService.ratePuzzle(puzzleId, rating);

    res.json({
      success: true,
      data: null
    } as APIResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to rate puzzle'
    } as APIResponse);
  }
});

// ============= ADMIN VERIFY ROUTE =============

// Verify puzzle
apiRouter.post('/admin/verify/:puzzleId', async (req, res) => {
  try {
    const { puzzleId } = req.params;
    await puzzleService.verifyPuzzle(puzzleId);

    res.json({
      success: true,
      data: { message: 'Puzzle verified successfully' }
    } as APIResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to verify puzzle'
    } as APIResponse);
  }
});

export default apiRouter;
