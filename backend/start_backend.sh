#!/bin/bash
echo "========================================"
echo "Payment Transactions System - Backend"
echo "========================================"
echo ""

echo "[1/2] Installing dependencies..."
python3 -m pip install --upgrade pip
python3 -m pip install -r requirements.txt

if [ $? -ne 0 ]; then
    echo ""
    echo "ERROR: Failed to install dependencies!"
    echo "Please check your Python installation."
    exit 1
fi

echo ""
echo "[2/2] Starting FastAPI server..."
echo "Server will be available at: http://localhost:8000"
echo "API Documentation: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
