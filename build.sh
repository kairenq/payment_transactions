#!/bin/bash
set -e

echo "=" | tr '=' '-' | head -c 80; echo
echo "🔨 Building Payment Transactions System"
echo "=" | tr '=' '-' | head -c 80; echo

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
pip install -r requirements.txt
cd ..

# Install frontend dependencies and build
echo "📦 Installing frontend dependencies..."
cd frontend
npm install

echo "🏗️  Building frontend..."
npm run build

echo "✅ Build completed!"
echo "   Frontend built to: frontend/dist"
echo "   Backend will serve frontend from this directory"
cd ..
