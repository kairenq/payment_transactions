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

echo [1/2] Installing Electron dependencies...
cd electron
if not exist "node_modules" (
    call npm install
)

echo.
echo [2/2] Building .exe installer...
echo This may take 5-10 minutes...
echo.
call npm run build:win
if errorlevel 1 (
    echo.
    echo [ERROR] Build failed! Check errors above.
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
echo OR portable version at:
echo   electron\dist\win-unpacked\Payment Transactions.exe
echo.
pause
explorer electron\dist
