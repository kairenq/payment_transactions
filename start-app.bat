@echo off
title Payment Transactions System
color 0A

echo ================================================
echo   Payment Transactions System
echo   Starting application...
echo ================================================
echo.

REM Проверка наличия Python
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python not found! Please install Python 3.8+
    pause
    exit /b 1
)

REM Проверка наличия Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js not found! Please install Node.js 18+
    pause
    exit /b 1
)

echo [1/4] Building frontend...
cd frontend
call npm install
call npm run build
if errorlevel 1 (
    echo [ERROR] Frontend build failed!
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo [2/4] Installing backend dependencies...
cd backend
pip install -r requirements.txt >nul 2>&1
cd ..

echo.
echo [3/4] Starting server...
echo.
echo ================================================
echo   Application is running!
echo   URL: http://localhost:8000
echo ================================================
echo.
echo Press Ctrl+C to stop the application
echo.

REM Запуск браузера через 2 секунды
start "" cmd /c "timeout /t 2 >nul && start http://localhost:8000"

REM Запуск сервера
cd backend
python -m uvicorn main:app --host 127.0.0.1 --port 8000

pause
