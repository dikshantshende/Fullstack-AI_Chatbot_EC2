@echo off
echo ========================================
echo   Starting LLM Agent Chatbot
echo ========================================
echo.

echo Checking environment...
if not exist ".env" (
    echo Error: .env file not found!
    echo Please make sure the .env file exists in the root directory
    pause
    exit /b 1
)

echo Step 1: Setting up database...
cd backend

REM Check if virtual environment exists
if not exist ".venv" (
    echo Error: Virtual environment not found!
    echo Please run setup_project.bat first
    pause
    exit /b 1
)

REM Activate virtual environment and run database setup
call .venv\Scripts\activate.bat
python scripts/init_db.py
if %errorlevel% neq 0 (
    echo Warning: Database initialization failed, but continuing...
)

echo.
echo Step 2: Starting backend server...
start "Backend Server" cmd /k "call .venv\Scripts\activate.bat && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

echo Waiting for backend to start...
timeout /t 3 /nobreak >nul

echo.
echo Step 3: Starting frontend...
cd ../frontend

REM Check if node_modules exists
if not exist "node_modules" (
    echo Error: Node modules not found!
    echo Please run setup_project.bat first
    pause
    exit /b 1
)

start "Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo   🎉 Project started successfully!
echo ========================================
echo.
echo Backend API: http://localhost:8000
echo Frontend UI: http://localhost:5173
echo API Health: http://localhost:8000/api/health
echo.
echo Both servers are running in separate windows.
echo Close those windows to stop the servers.
echo.
echo Press any key to exit this script...
pause >nul

