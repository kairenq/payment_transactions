#!/bin/bash
# Render startup script for Payment Transactions API

echo "🚀 Starting Payment Transactions API..."

# Initialize database
python -c "from database import db; db.init_database(); print('✅ Database initialized')"

# Start uvicorn server
uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
