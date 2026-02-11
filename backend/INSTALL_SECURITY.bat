@echo off
echo ========================================
echo Installing Security Packages
echo For Python 3.14+
echo ========================================
echo.

echo Uninstalling old bcrypt...
python -m pip uninstall bcrypt passlib -y

echo.
echo Installing new security packages...
python -m pip install passlib argon2-cffi python-jose[cryptography] python-dotenv

echo.
echo Done! Now you can start the backend.
pause
