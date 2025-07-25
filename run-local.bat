@echo off
echo Starting Baby Shower Website locally...
echo.

echo Starting Backend (CSV Mode)...
cd backend
start cmd /k "npm run dev"

echo.
echo Starting Frontend...
cd ../frontend
start cmd /k "npm start"

echo.
echo Application starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit this launcher...
pause > nul 