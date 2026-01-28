@echo off
echo ========================================
echo E-Commerce Setup Script
echo ========================================
echo.

echo Installing backend dependencies...
cd marketplace-backend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo Backend installation failed!
    exit /b 1
)

echo Generating Prisma Client...
call npx prisma generate
if %ERRORLEVEL% NEQ 0 (
    echo Prisma generation failed!
    exit /b 1
)
cd ..

echo.
echo Installing frontend dependencies...
cd marketplace-frontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo Frontend installation failed!
    exit /b 1
)
cd ..

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Configure environment variables in .env files
echo 2. Run database migrations: cd marketplace-backend && npm run prisma:migrate
echo 3. Start backend: npm run start:dev
echo 4. Start frontend: cd ../marketplace-frontend && npm run dev
echo.
pause
