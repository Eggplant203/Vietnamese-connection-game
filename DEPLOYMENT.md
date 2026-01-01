# 🚀 Deployment Guide

Hướng dẫn triển khai Vietnamese Connections Game lên Render (Backend) và Netlify (Frontend).

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

- **Name**: `vn-connections-backend` (hoặc tên khác)
- **Region**: Singapore (hoặc gần nhất)
- **Branch**: `main`
- **Root Directory**: Leave blank
- **Build Command**: `npm install && cd server && npm install && npm run build`
- **Start Command**: `cd server && node dist/index.js`
- **Instance Type**: Free (hoặc Starter $7/month cho tốc độ cao hơn)

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

1. Đăng nhập [Netlify Dashboard](https://app.netlify.com/)
2. Click **Add new site** → **Import an existing project**
3. Choose GitHub → Select repository
4. Cấu hình:

**Build Settings**:

- **Base directory**: Leave blank
- **Build command**: `npm install && cd client && npm install && npm run build`
- **Publish directory**: `client/dist`
- **Branch**: `main`

### 3.2. Environment Variables (Netlify)

Vào **Site settings** → **Environment variables** → Add:

```env
VITE_API_URL=https://your-service.onrender.com/api
```

**⚠️ QUAN TRỌNG**: Thay `your-service.onrender.com` bằng URL thực tế từ Render (bước 2.4)

### 3.3. Deploy

1. Click **Deploy site**
2. Đợi build (~2-3 phút)
3. Copy **Site URL**: `https://your-app.netlify.app`

### 3.4. Update Backend CORS

Quay lại **Render** → Environment Variables → Cập nhật:

```env
CORS_ORIGIN=https://your-app.netlify.app
```

**Manual Deploy** backend để áp dụng thay đổi.

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

---

## 🔧 Troubleshooting

### Backend không start được

- ✅ Kiểm tra logs trong Render Dashboard
- ✅ Verify `DATABASE_URL` đúng format
- ✅ Test connection string trực tiếp với `psql` hoặc database tool

### Frontend không connect được backend

- ✅ Kiểm tra `VITE_API_URL` có đúng URL Render
- ✅ Verify `CORS_ORIGIN` ở backend match với Netlify URL
- ✅ Check Network tab trong DevTools để xem lỗi CORS

### Admin login không được

- ✅ Verify `ADMIN_PASSWORD` trong Render env variables
- ✅ Check console logs khi submit form
- ✅ Kiểm tra JWT_SECRET đã set chưa

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

## 🔐 Security Checklist

- ✅ JWT_SECRET ít nhất 32 ký tự random
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

```env
VITE_API_URL=https://your-service.onrender.com/api
```

---

## 🆘 Support

Nếu gặp vấn đề:

1. Check Render logs: Dashboard → your-service → Logs
2. Check Netlify logs: Site settings → Build & deploy → Deploy log
3. Open browser DevTools → Console/Network tab
4. Tạo issue trên GitHub repository

---

**Happy Deploying! 🎉**
