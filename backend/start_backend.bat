@echo off
echo ========================================
echo Payment Transactions System - Backend
echo ========================================
echo.

echo [1/2] Installing dependencies...
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
if errorlevel 1 (
    echo.
    echo ERROR: Failed to install dependencies!
    echo Please check your Python installation.
    pause
    exit /b 1
)

echo.
echo [2/2] Starting FastAPI server...
echo Server will be available at: http://localhost:8000
echo API Documentation: http://localhost:8000/docs
echo.
echo Press Ctrl+C to stop the server
echo.

python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload

pause
