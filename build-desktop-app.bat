@echo off
title Building Desktop Application
color 0B

echo ================================================
echo   Payment Transactions System
echo   Building Desktop Application (.exe)
echo ================================================
echo.

REM Проверка Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js not found! Please install Node.js 18+
    pause
    exit /b 1
)

REM Проверка Python
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python not found! Please install Python 3.8+
    pause
    exit /b 1
)

echo [1/5] Building frontend...
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
echo [2/5] Installing backend dependencies...
cd backend
pip install -r requirements.txt
cd ..

echo.
echo [3/5] Installing Electron dependencies...
cd electron
call npm install
if errorlevel 1 (
    echo [ERROR] Electron dependencies installation failed!
    cd ..
    pause
    exit /b 1
)

echo.
echo [4/5] Building .exe installer...
echo This may take 5-10 minutes...
call npm run build:win
if errorlevel 1 (
    echo [ERROR] Electron build failed!
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo ================================================
echo   Build Complete!
echo ================================================
echo.
echo Your .exe installer is ready at:
echo   electron\dist\Payment Transactions Setup 1.0.0.exe
echo.
echo Double-click to install the application!
echo.
pause
