@echo off
echo ========================================
echo Payment Transactions System - Frontend
echo ========================================
echo.

echo [1/2] Installing dependencies...
call npm install
if errorlevel 1 (
    echo.
    echo ERROR: Failed to install dependencies!
    echo Make sure Node.js and npm are installed.
    pause
    exit /b 1
)

echo.
echo [2/2] Starting Vite dev server...
echo.
echo Frontend will open automatically in your browser
echo Or manually open: http://localhost:5173
echo.
echo Press Ctrl+C to stop the server
echo.

call npm run dev

if errorlevel 1 (
    echo.
    echo ERROR: Failed to start dev server!
    echo Check the error messages above.
    pause
)

pause
