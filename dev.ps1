# Development Runner Script
# This script starts both server and client in development mode

Write-Host "🚀 Starting Vietnamese Connections Development Environment..." -ForegroundColor Green
Write-Host ""

# Check if Node.js is installed
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Check if dependencies are installed
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm run install:all
}

# Start server in background
Write-Host "🔧 Starting Backend Server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\server'; npm run dev"

# Wait a bit for server to start
Start-Sleep -Seconds 3

# Start client in background
Write-Host "🎨 Starting Frontend Client..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\client'; npm run dev"

Write-Host ""
Write-Host "✅ Development servers are starting!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Frontend: http://localhost:5173" -ForegroundColor Yellow
Write-Host "🔗 Backend:  http://localhost:3000" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Ctrl+C in each terminal window to stop the servers" -ForegroundColor Gray
