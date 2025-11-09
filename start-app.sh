#!/bin/bash

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}  Payment Transactions System${NC}"
echo -e "${BLUE}  Starting application...${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""

# Check Python
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}[ERROR] Python3 not found! Please install Python 3.8+${NC}"
    exit 1
fi

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}[ERROR] Node.js not found! Please install Node.js 18+${NC}"
    exit 1
fi

echo -e "${GREEN}[1/4] Building frontend...${NC}"
cd frontend
npm install
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}[ERROR] Frontend build failed!${NC}"
    exit 1
fi
cd ..

echo ""
echo -e "${GREEN}[2/4] Installing backend dependencies...${NC}"
cd backend
pip3 install -r requirements.txt > /dev/null 2>&1
cd ..

echo ""
echo -e "${GREEN}[3/4] Starting server...${NC}"
echo ""
echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}  Application is running!${NC}"
echo -e "${BLUE}  URL: http://localhost:8000${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""
echo "Press Ctrl+C to stop the application"
echo ""

# Open browser after 2 seconds (background)
(sleep 2 && xdg-open http://localhost:8000 2>/dev/null || open http://localhost:8000 2>/dev/null) &

# Start server
cd backend
python3 -m uvicorn main:app --host 127.0.0.1 --port 8000
