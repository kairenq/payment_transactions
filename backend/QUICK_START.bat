@echo off
REM ========================================
REM БЫСТРЫЙ ЗАПУСК БЕЗ УСТАНОВКИ ЗАВИСИМОСТЕЙ
REM Используйте если зависимости уже установлены
REM ========================================

echo Starting FastAPI server...
echo.
echo Server: http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo.
echo Press Ctrl+C to stop
echo.

python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload

pause
