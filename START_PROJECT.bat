@echo off
setlocal
title CREDITPULSE: STARTING ALL SYSTEMS 🚀
cls
echo ========================================================
echo   CREDITPULSE MSME SCORING ENGINE - BOOT SEQUENCE
echo ========================================================

:: STEP 1: KILL STALE PROCESSES
echo [1/4] Force-killing any old servers on Port 3000 and 8000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000') do taskkill /f /pid %%a >nul 2>&1

:: STEP 2: START BACKEND (FASTAPI)
echo [2/4] Starting FastAPI High-Performance Engine (Port 8000)...
start "CreditPulse: Python API" cmd /k "cd server && python -m pip install -r requirements.txt && python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload"

:: STEP 3: START FRONTEND (NEXT.JS)
echo [3/4] Starting Next.js UI Dashboard (Port 3000)...
start "CreditPulse: Next.js UI" cmd /k "cd client && npm install && npm run dev -- -p 3000 -H 127.0.0.1"

:: STEP 4: LAUNCH BROWSER
echo [4/4] Opening Dashboard in 5 seconds...
timeout /t 5 >nul
start http://127.0.0.1:3000

echo.
echo ========================================================
echo   INITIALIZATION COMPLETE! IF UI IS BLANK, REFRESH ↺
echo ========================================================
pause
