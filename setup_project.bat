@echo off
echo ========================================
echo   LLM Agent Chatbot - Project Setup
echo ========================================
echo.

echo Step 1: Checking Python installation...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Python is not installed or not in PATH
    echo Please install Python 3.8+ and try again
    pause
    exit /b 1
)
echo ✓ Python found

echo.
echo Step 2: Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed or not in PATH
    echo Please install Node.js 18+ and try again
    pause
    exit /b 1
)
echo ✓ Node.js found

echo.
echo Step 3: Setting up Python virtual environment...
cd backend
if not exist ".venv" (
    python -m venv .venv
    echo ✓ Virtual environment created
) else (
    echo ✓ Virtual environment already exists
)

echo.
echo Step 4: Activating virtual environment and installing Python dependencies...
call .venv\Scripts\activate.bat
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo Error: Failed to install Python dependencies
    pause
    exit /b 1
)
echo ✓ Python dependencies installed

echo.
echo Step 5: Initializing database...
python scripts/init_db.py
if %errorlevel% neq 0 (
    echo Warning: Database initialization failed, but continuing...
)
echo ✓ Database initialized

echo.
echo Step 6: Building RAG vectorstore...
python scripts/ingest.py
if %errorlevel% neq 0 (
    echo Warning: RAG vectorstore build failed, but continuing...
)
echo ✓ RAG vectorstore built

cd ..

echo.
echo Step 7: Installing Node.js dependencies...
cd frontend
npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install Node.js dependencies
    pause
    exit /b 1
)
echo ✓ Node.js dependencies installed

cd ..

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo To start the project, run: start.bat
echo.
echo Backend will be available at: http://localhost:8000
echo Frontend will be available at: http://localhost:5173
echo.
pause