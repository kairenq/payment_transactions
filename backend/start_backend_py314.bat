@echo off
REM ========================================
REM Payment Transactions System - Backend
REM Optimized for Python 3.14+
REM ========================================
echo ========================================
echo Payment Transactions System - Backend
echo Python 3.14+ Version
echo ========================================
echo.

echo [1/2] Installing dependencies (Python 3.14+ compatible)...
python -m pip install --upgrade pip
python -m pip install fastapi uvicorn[standard] pydantic pydantic[email] python-multipart email-validator --upgrade
if errorlevel 1 (
    echo.
    echo ERROR: Failed to install dependencies!
    echo.
    echo Trying alternative method...
    python -m pip install --only-binary :all: fastapi uvicorn pydantic python-multipart
    if errorlevel 1 (
        echo ERROR: Please check your Python installation.
        pause
        exit /b 1
    )
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
