@echo off
title Building Portable Application
color 0B

echo ================================================
echo   Payment Transactions System
echo   Building Portable Application (no install)
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
echo [4/5] Building portable version...
echo This may take 5-10 minutes...
call npm run pack
if errorlevel 1 (
    echo [ERROR] Electron build failed!
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo [5/5] Creating portable package...
if exist "portable-app" rmdir /s /q "portable-app"
mkdir "portable-app"
xcopy "electron\dist\win-unpacked\*" "portable-app\" /E /I /H /Y

echo.
echo ================================================
echo   Portable App Ready!
echo ================================================
echo.
echo Your portable application is in:
echo   portable-app\
echo.
echo Usage:
echo   1. Copy entire "portable-app" folder to USB/other PC
echo   2. Run: Payment Transactions.exe
echo   3. Works without installation!
echo.
echo Folder size: ~400-500 MB
echo.
pause
