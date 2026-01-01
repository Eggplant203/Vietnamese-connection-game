import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), message: 'Server is running!' });
});

app.get('/api/test', (_req, res) => {
  res.json({ 
    success: true, 
    message: 'API is working!',
    data: {
      features: [
        'Daily Puzzle',
        'Unlimited Mode',
        'AI Generation',
        'Leaderboard',
        'User Stats'
      ]
    }
  });
});

app.listen(PORT, () => {
  console.log(`✅ Test server running on http://localhost:${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API test: http://localhost:${PORT}/api/test`);
});
