@echo off
title Payment Transactions - Desktop App
color 0A

echo ================================================
echo   Payment Transactions System
echo   Starting Desktop Application...
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

echo [1/3] Installing Electron (first time only)...
cd electron
if not exist "node_modules" (
    call npm install
)

echo.
echo [2/3] Building frontend (if needed)...
cd ..\frontend
if not exist "dist" (
    call npm install
    call npm run build
)

echo.
echo [3/3] Starting desktop application...
echo.
cd ..\electron
call npm start
