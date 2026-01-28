@echo off
echo.
echo ========================================
echo Marketplace Frontend Setup Script
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js found: 
node --version
echo.

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm is not installed.
    pause
    exit /b 1
)

echo ✅ npm found:
npm --version
echo.

REM Install dependencies
echo Installing dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm install failed!
    pause
    exit /b 1
)

echo.
echo ✅ Dependencies installed successfully!
echo.

REM Check for .env.local
if not exist .env.local (
    echo ⚠️  .env.local not found. Creating from .env.example...
    copy .env.example .env.local
    echo.
    echo 📝 Please update .env.local with your Firebase credentials
    echo.
)

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Update .env.local with Firebase credentials
echo 2. Run 'npm run dev' to start development server
echo 3. Open http://localhost:3000
echo.
echo For deployment:
echo 1. Read DEPLOYMENT_GUIDE.md
echo 2. Push to GitHub
echo 3. Connect Vercel and deploy
echo.
pause
