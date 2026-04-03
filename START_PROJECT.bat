@echo off
echo.
echo ===========================================
echo   Initializing CreditPulse MVP Engines 🚀
echo ===========================================
echo.

echo [1/2] Starting Python FastAPI Backend Engine...
start "CreditPulse Backend Engine" cmd /k "cd server && pip install -r requirements.txt && uvicorn main:app --host 0.0.0.0 --port 8000"

echo [2/2] Starting Next.js UI Dashboard...
start "CreditPulse Frontend Dashboard" cmd /k "cd client && npm install && npm run dev"

echo.
echo Servers are starting up! 
echo Frontend UI will be available at: http://localhost:3000
echo Backend API is running at: http://localhost:8000
echo.
pause
