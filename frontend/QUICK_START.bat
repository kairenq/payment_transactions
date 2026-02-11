@echo off
REM ========================================
REM БЫСТРЫЙ ЗАПУСК (без установки зависимостей)
REM Используйте если зависимости уже установлены
REM ========================================

echo Starting Vite dev server...
echo.
echo Frontend: http://localhost:5173
echo.
echo Press Ctrl+C to stop
echo.

call npm run dev

pause
