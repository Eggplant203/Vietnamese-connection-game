# 🚀 Deployment Guide

Hướng dẫn deploy ứng dụng VN Connections lên Render (backend) và Netlify (frontend).

**✅ Updated: January 2026 - Đã fix tất cả lỗi TypeScript, API routing, và SPA navigation**

---

## 📋 Prerequisites

- [GitHub](https://github.com) account
- [Render](https://render.com) account
- [Netlify](https://netlify.com) account
- [Neon](https://neon.tech) PostgreSQL database
- Google Gemini API key(s)

---

## 🗄️ Step 1: Setup Neon Database

1. Tạo tài khoản tại [neon.tech](https://neon.tech)
2. Tạo new project → new database
3. Copy **Connection String**:
   ```
   postgresql://user:password@host/database?sslmode=require
   ```
4. Database sẽ tự động tạo tables khi backend start lần đầu

---

## 🔧 Step 2: Deploy Backend to Render

### 2.1. Push Code to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2.2. Create Render Web Service

1. Đăng nhập [Render Dashboard](https://dashboard.render.com/)
2. Click **New** → **Web Service**
3. Connect GitHub repository
4. Cấu hình:

**Settings**:

- **Name**: `vietnamese-connection-game` (hoặc tên khác)
- **Region**: Singapore (hoặc gần nhất)
- **Branch**: `main`
- **Root Directory**: `server`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Instance Type**: Free (hoặc Starter $7/month cho tốc độ cao hơn)

**⚠️ LƯU Ý**: 
- Build command tự động chạy `prebuild` script để copy shared types
- Tất cả @types packages đã ở trong dependencies (không phải devDependencies)

### 2.3. Environment Variables (Render)

Thêm các biến sau vào **Environment** tab:

```env
PORT=3000
NODE_ENV=production

# Database URL từ Neon
DATABASE_URL=postgresql://user:password@host/database?sslmode=require&connect_timeout=10

# Google Gemini API Keys (thêm nhiều keys để tăng quota)
GEMINI_API_KEY=AIzaSy...your_key_1
GEMINI_API_KEY_2=AIzaSy...your_key_2  # Optional - thêm nếu cần tăng quota
GEMINI_API_KEY_3=AIzaSy...your_key_3  # Optional

# Authentication (tạo random string mạnh)
JWT_SECRET=<random-secret-at-least-32-chars>
ADMIN_PASSWORD=<your-secure-admin-password>

# CORS - URL frontend Netlify (thêm sau bước 3)
CORS_ORIGIN=https://your-app.netlify.app
```

**Cách tạo JWT_SECRET mạnh**:

```bash
# Trên PowerShell:
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

### 2.4. Deploy

1. Click **Create Web Service**
2. Đợi deploy hoàn tất (~5-10 phút)
3. Copy **Service URL**: `https://your-service.onrender.com`

**Kiểm tra backend**:

```
https://your-service.onrender.com/health
```

Kết quả mong đợi:

```json
{ "status": "ok", "timestamp": "2026-01-01T00:00:00.000Z" }
```

---

## 🌐 Step 3: Deploy Frontend to Netlify

### 3.1. Create Netlify Site

**⚠️ QUAN TRỌNG**: Project đã có file `netlify.toml` ở root directory, Netlify sẽ tự động sử dụng config này!

**Nội dung `netlify.toml`**:
```toml
[build]
  base = "client"
  command = "npm run build"
  publish = "dist"

[build.environment]
  VITE_API_URL = "https://vietnamese-connection-game.onrender.com/api"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 3.2. Cập nhật Backend URL

**Bước quan trọng**: Sau khi có URL từ Render (bước 2.4), cần cập nhật:

1. Mở file `netlify.toml` 
2. Thay đổi `VITE_API_URL` thành URL backend thực tế:
   ```toml
   VITE_API_URL = "https://your-actual-service.onrender.com/api"
   ```
3. Commit và push:
   ```bash
   git add netlify.toml
   git commit -m "Update backend API URL"
   git push
   ```

**Hoặc**: Vào Netlify Dashboard → Site settings → Environment variables → Override `VITE_API_URL`
VITE_API_URL=https://your-service.onrender.com/api
```

**⚠️ QUAN TRỌNG**: Thay `your-service.onrender.com` bằng URL thực tế từ Render (bước 2.4)

### 3.3. Deploy

1. Netlify sẽ tự động trigger deploy khi push code
2. Đợi build (~2-3 phút)
3. Copy **Site URL**: `https://your-app.netlify.app`

**File quan trọng đã được setup**:
- ✅ `client/public/_redirects` - Handle SPA routing (tránh 404 khi refresh)
- ✅ `client/.env.production` - Production API URL
- ✅ `client/src/env.d.ts` - TypeScript support cho Vite env

### 3.4. Update Backend CORS

Quay lại **Render** → Environment Variables → Cập nhật:

```env
CORS_ORIGIN=https://your-app.netlify.app
```

Click **Manual Deploy** để áp dụng thay đổi.

---

## ✅ Step 4: Verification

### 4.1. Test Frontend

Truy cập `https://your-app.netlify.app`:

- ✅ Trang chủ hiển thị
- ✅ Click "Kho lưu trữ" hoặc "AI" để load puzzle
- ✅ Gameplay hoạt động bình thường

### 4.2. Test Admin Panel

1. Truy cập `https://your-app.netlify.app/admin/login`
2. Nhập password từ `ADMIN_PASSWORD`
3. Upload thử 1 puzzle
4. Verify puzzle hoạt động

### 4.3. Test API

```bash
# Health check
curl https://your-service.onrender.com/health

# Get random puzzle from database
curl https://your-service.onrender.com/api/archive
```
Build Fails với TypeScript Errors

**Lỗi**: `Cannot find module 'express'`, `Cannot find name 'process'`

**Nguyên nhân**: @types packages bị thiếu hoặc ở devDependencies

**Giải pháp**: ✅ ĐÃ FIX - Tất cả @types packages đã được move vào `dependencies` trong `server/package.json`

### Backend Build Fails - Cannot find '../shared/Types'

**Lỗi**: `Cannot find module '../shared/Types'`

**Nguyên nhân**: Shared types folder không được copy vào server

**Giải pháp**: ✅ ĐÃ FIX - `prebuild` script tự động copy `../shared` vào `server/src/shared`

### Frontend gọi sai API endpoint (404)

**Lỗi**: `GET /archive 404` thay vì `/api/archive`

**Nguyên nhân**: `VITE_API_URL` không được set đúng

**Giải pháp**: 
- ✅ Kiểm tra `netlify.toml` có đúng backend URL
- ✅ Hoặc set trong Netlify env variables
- ✅ Verify build log có log: `VITE_API_URL = "https://..."`

### Admin panel bị 404 (Netlify)

**Lỗi**: "Page not found" khi truy cập `/admin` hoặc `/admin/login`

**Nguyên nhân**: SPA routing không được config

**Giải pháp**: ✅ ĐÃ FIX
- `client/public/_redirects` file đã có
- `netlify.toml` có redirects config
- Tất cả routes → `index.html` với status 200

### Admin login gọi sai endpoint

**Lỗi**: `POST https://your-app.netlify.app/api/admin/login 404`
 - Auto enabled
- Setup **Custom Domain** nếu có
- ✅ **Redirects đã được config** trong `netlify.toml` và `client/public/_redirects`
- Monitor builds trong **Deploys** tab CORS Error

**Lỗi**: `Access to XMLHttpRequest blocked by CORS policy`

**Giải pháp**:
- ✅ Kiểm tra `CORS_ORIGIN` trong Render = Netlify URL chính xác
- ✅ Không có trailing slash: `https://app.netlify.app` ✅, `https://app.netlify.app/` ❌
- ✅ Manual Deploy backend sau khi thay đổi env
### AI puzzle không generate được

- ✅ Verify `GEMINI_API_KEY` còn quota
- ✅ Add thêm keys: `GEMINI_API_KEY_2`, `GEMINI_API_KEY_3`
- ✅ Check Render logs để xem error từ Gemini API

---

## 📊 Performance Tips

### Render (Backend)

- Upgrade lên **Starter ($7/month)** để tránh cold start
- Enable **Auto-Deploy** để tự động deploy khi push code
- Monitor trong **Metrics** tab

### Netlify (Frontend)

- Enable **Asset Optimization** (minify CSS/JS)
- Setup **Custom Domain** nếu có
- Configure **Redirects** cho SPA routing:

Tạo file `client/public/_redirects`:

```
/* /index.html 200
```

---

**Option 1**: Trong `netlify.toml` (recommended)
```toml
[build.environment]
  VITE_API_URL = "https://your-service.onrender.com/api"
```

**Option 2**: Trong Netlify Dashboard
```env
VITE_API_URL=https://your-service.onrender.com/api
```

**Files liên quan**:
- `client/.env.production` - Fallback cho production builds
- `client/.env.local` - Development local (git ignored) JWT_SECRET ít nhất 32 ký tự random
- ✅ ADMIN_PASSWORD mạnh (>12 ký tự, chữ + số + ký tự đặc biệt)
- ✅ DATABASE_URL chứa `?sslmode=require`
- ✅ CORS_ORIGIN chính xác URL frontend
- ✅ Không commit `.env` file vào Git
- ✅ Gemini API keys được rotate khi hết quota

---

## 📝 Environment Variables Summary

### Backend (Render)

```env
PORT=3000
NODE_ENV=production
DATABASE_URL=postgresql://...
GEMINI_API_KEY=...
GEMINI_API_KEY_2=...  # Optional - thêm nếu cần tăng quota
GEMINI_API_KEY_3=...  # Optional
JWT_SECRET=...
ADMIN_PASSWORD=...
CORS_ORIGIN=https://your-app.netlify.app
```

### Frontend (Netlify)

```📁 Project Structure (Deployment Relevant)

```
connections/
├── netlify.toml              # Netlify config (build + env + redirects)
├── server/
│   ├── package.json          # @types ở dependencies, có prebuild script
│   ├── tsconfig.json         # types: ["node"], typeRoots config
│   └── src/
│       └── shared/           # Auto-copied từ ../shared qua prebuild
└── client/
    ├── .env.production       # Production API URL
    ├── .env.local           # Development (git ignored)
    ├── src/
    │   ├── env.d.ts         # Vite env types
    │   └── services/
    │       └── api.ts       # Sử dụng VITE_API_URL
    └── public/
        └── _redirects       # SPA routing fix
```

## 🆘 Support

Nếu gặp vấn đề:

1. **Backend issues**: 
   - Check Render logs: Dashboard → your-service → Logs
   - Verify all env variables are set
   - Test health endpoint: `https://your-service.onrender.com/health`

2. **Frontend issues**:
   - Check Netlify build logs: Site settings → Deploys → View log
   - Open browser DevTools → Console/Network tab
   - Verify API calls go to Render domain, not Netlify

3. **TypeScript build errors**:
   - Verify `server/package.json` có tất cả @types trong dependencies
   - Check `server/tsconfig.json` có `"types": ["node"]`
   - Ensure prebuild script runs successfully

4. **Common fixes**:
   - Clear Render/Netlify cache và rebuild
   - Manual deploy sau khi thay đổi env variables
   - Kiểm tra CORS_ORIGIN match chính xác với frontend URL

---

**Happy Deploying! 🎉**

**Các lỗi phổ biến đã được fix sẵn trong code - chỉ cần config đúng env variables!: Site settings → Build & deploy → Deploy log
3. Open browser DevTools → Console/Network tab
4. Tạo issue trên GitHub repository

---

**Happy Deploying! 🎉**
