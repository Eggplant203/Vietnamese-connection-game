import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { WebSocketServer } from 'ws';
import http from 'http';

// Import routes
import { apiRouter } from './api/routes';
import { adminRouter } from './api/adminRoutes';
import { cleanupService } from './services/cleanupService';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api', apiRouter);
app.use('/api/admin', adminRouter);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not found'
  });
});

// Create HTTP server
const server = http.createServer(app);

// WebSocket server
const wss = new WebSocketServer({ server, path: '/ws' });

wss.on('connection', (ws) => {
  console.log('WebSocket client connected');

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      console.log('Received:', data);
      
      // Broadcast to all clients
      wss.clients.forEach((client) => {
        if (client.readyState === 1) {
          client.send(JSON.stringify(data));
        }
      });
    } catch (error) {
      console.error('WebSocket error:', error);
    }
  });

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });

  // Send welcome message
  ws.send(JSON.stringify({ type: 'connected', message: 'Welcome to VN Connections!' }));
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 HTTP: http://localhost:${PORT}`);
  console.log(`🔗 WebSocket: ws://localhost:${PORT}/ws`);
  
  // Run cleanup every 6 hours
  const CLEANUP_INTERVAL = 6 * 60 * 60 * 1000; // 6 hours
  setInterval(async () => {
    try {
      // Delete puzzles with rating < -10
      const deletedUnpopular = await cleanupService.deleteUnpopularPuzzles();
      if (deletedUnpopular > 0) {
        console.log(`🧹 Cleanup: Removed ${deletedUnpopular} unpopular puzzle(s)`);
      }
      
      // Delete unverified puzzles > 24h old
      const deletedUnverified = await cleanupService.deleteUnverifiedPuzzles();
      if (deletedUnverified > 0) {
        console.log(`🧹 Cleanup: Removed ${deletedUnverified} unverified puzzle(s)`);
      }
    } catch (error) {
      console.error('❌ Cleanup error:', error);
    }
  }, CLEANUP_INTERVAL);
  
  // Run initial cleanup
  cleanupService.deleteUnpopularPuzzles().catch(console.error);
  cleanupService.deleteUnverifiedPuzzles().catch(console.error);
});

export default app;
