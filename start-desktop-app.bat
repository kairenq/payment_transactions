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

echo Installing Electron (first time only)...
cd electron
if not exist "node_modules" (
    call npm install
)

echo.
echo Starting desktop application...
echo Connecting to: https://payment-transactions.onrender.com
echo.
call npm start
