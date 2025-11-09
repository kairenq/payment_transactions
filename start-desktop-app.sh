#!/bin/bash

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}  Payment Transactions System${NC}"
echo -e "${BLUE}  Starting Desktop Application...${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}[ERROR] Node.js not found! Please install Node.js 18+${NC}"
    exit 1
fi

# Check Python
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}[ERROR] Python3 not found! Please install Python 3.8+${NC}"
    exit 1
fi

echo -e "${GREEN}[1/3] Installing Electron (first time only)...${NC}"
cd electron
if [ ! -d "node_modules" ]; then
    npm install
fi

echo ""
echo -e "${GREEN}[2/3] Building frontend (if needed)...${NC}"
cd ../frontend
if [ ! -d "dist" ]; then
    npm install
    npm run build
fi

echo ""
echo -e "${GREEN}[3/3] Starting desktop application...${NC}"
echo ""
cd ../electron
npm start
