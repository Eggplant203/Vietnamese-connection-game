# Vietnamese Connections Game 🧩

A Vietnamese-language puzzle game inspired by NYT Connections, where players find groups of 4 related words from a 16-word grid. Features AI-generated puzzles, admin panel, and rating system.

![Gameplay](pictures/gameplay.png)

## � Play Online

**Live Demo:** https://connections-vie.netlify.app/

> **Note:** Backend uses free tier hosting. If you experience delays when creating/joining rooms, please wait 1-2 minutes for the server to wake up from sleep mode.

## �🎮 Features

- **Dynamic Puzzle System**: Play from database archive or generate new puzzles with Google Gemini AI
- **Progressive Difficulty**: 4 difficulty tiers (Green → Yellow → Purple → Red)
- **User Statistics**: Track games played, win rate, streaks, best time, and highest score
- **Rating System**: Vote on puzzle quality (auto-delete puzzles with rating < -10)
- **Admin Panel**: Upload custom puzzles, verify AI-generated puzzles, manage database
- **Auto-Cleanup**: Unverified AI puzzles deleted after 24 hours
- **Multi-Key Support**: Automatic fallback between multiple Gemini API keys

## 🏗️ Tech Stack

**Frontend**: React + TypeScript + Vite + Tailwind CSS + Framer Motion + Zustand  
**Backend**: Express + TypeScript + PostgreSQL (Neon) + Google Gemini AI + JWT

## 📦 Project Structure

```
connections/
├── client/          # React frontend (Vite)
├── server/          # Express backend
├── shared/          # Shared TypeScript types
└── pictures/        # Screenshots
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

**`server/.env`**:

```env
# Server
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# Google Gemini API Keys (multiple for quota rotation)
GEMINI_API_KEY=your_key_1
GEMINI_API_KEY_2=your_key_2  # Optional - add more keys to increase quota
GEMINI_API_KEY_3=your_key_3  # Optional

# Authentication
JWT_SECRET=your-secret-key-here
ADMIN_PASSWORD=your-admin-password
```

**`client/.env`**:

```env
VITE_API_URL=http://localhost:3000/api
```

### 3. Setup Database

The system auto-creates tables on first run. Database schema:

```sql
CREATE TABLE puzzles (
  id VARCHAR(255) PRIMARY KEY,
  game_name VARCHAR(255),
  overall_difficulty VARCHAR(50),
  data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  created_by VARCHAR(50) DEFAULT 'ADMIN',
  rating INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT FALSE
);
```

### 4. Run Development

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- Admin Panel: http://localhost:5173/admin/login

### 5. Admin Access

Navigate to `/admin/login` and use the password from `ADMIN_PASSWORD` env variable.

![Admin Login](pictures/admin_login.png)
![Admin Panel](pictures/admin_panel.png)

## 🎯 How to Play

1. Select 4 words you think belong to the same category
2. Submit your guess (4 attempts total)
3. Find all 4 groups to win
4. Rate the puzzle after completion
5. Track your stats (win rate, streaks, best score)

**Difficulty Tiers**:

- 🟢 Green: Obvious, concrete
- 🟡 Yellow: Conceptual
- 🟣 Purple: Abstract, pattern-based
- 🔴 Red: Wordplay, hidden structure

## 🤖 AI Puzzle Generation

Uses Google Gemini AI (`gemini-2.5-flash`) with Vietnamese language support. Auto-rotates between multiple API keys when quota exceeded (20 requests/day per free key).

## 🔐 Security

- JWT authentication for admin panel
- Password-protected admin access
- 7-day token expiry
- CORS protection

## 📊 Key Features

### Auto-Cleanup Service

Runs every 6 hours:

- Delete puzzles with rating < -10
- Delete unverified AI puzzles > 24h old

### Admin Panel Features

- Upload custom puzzles
- Verify AI-generated puzzles
- View full puzzle details
- Delete puzzles
- Visual verified/unverified badges

### User Statistics

- Games played & win rate
- Current & max streak
- Best completion time
- Highest score

## 🌐 API Endpoints

**Public**:

- `GET /api/archive` - Random puzzle from DB
- `GET /api/random` - AI-generated puzzle
- `POST /api/submit` - Validate guess
- `POST /api/rate` - Rate puzzle

**Admin** (Protected):

- `POST /api/admin/login` - Authenticate
- `GET /api/admin/puzzles` - List all
- `POST /api/admin/upload` - Create puzzle
- `POST /api/admin/verify/:id` - Verify puzzle
- `DELETE /api/admin/puzzles/:id` - Delete

## 🏗️ Build for Production

```bash
npm run build
```

Outputs:

- `server/dist/` - Compiled TypeScript
- `client/dist/` - Optimized React bundle

## 🚀 Deployment

📖 **[Xem hướng dẫn chi tiết deployment](DEPLOYMENT.md)**

### Quick Summary

**Backend (Render)**:

- Build: `npm install && cd server && npm install && npm run build`
- Start: `cd server && node dist/index.js`
- Root Directory: Leave blank

**Frontend (Netlify)**:

- Build: `npm install && cd client && npm install && npm run build`
- Publish: `client/dist`
- Base Directory: Leave blank

**Required Environment Variables**:

- Backend: `DATABASE_URL`, `GEMINI_API_KEY`, `JWT_SECRET`, `ADMIN_PASSWORD`, `CORS_ORIGIN`
- Frontend: `VITE_API_URL`

> **⚠️ Important**: GEMINI_API_KEY_2 và \_3 là optional - chỉ thêm nếu cần tăng quota.

## 📝 Scripts

```bash
npm run dev             # Start both servers
npm run dev:server      # Backend only
npm run dev:client      # Frontend only
npm run build           # Build both
npm run build:server    # Compile TypeScript
npm run build:client    # Vite build
```

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push and create PR

## 📄 License

MIT License

## Author

© 2025 - Developed by Eggplant203 🍆

---

**Made with ❤️ for Vietnamese word puzzle enthusiasts**
