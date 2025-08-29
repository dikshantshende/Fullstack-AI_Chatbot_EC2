#!/bin/bash

echo "========================================"
echo "  LLM Agent Chatbot - Project Setup"
echo "========================================"
echo

# Step 1: Checking Python installation
echo "Step 1: Checking Python installation..."
if ! command -v python3 &> /dev/null
then
    echo "Error: Python3 is not installed or not in PATH"
    echo "Please install Python 3.8+ and try again"
    exit 1
fi
echo "✓ Python found: $(python3 --version)"

echo
# Step 2: Checking Node.js installation
echo "Step 2: Checking Node.js installation..."
if ! command -v node &> /dev/null
then
    echo "Error: Node.js is not installed or not in PATH"
    echo "Please install Node.js 18+ and try again"
    exit 1
fi
echo "✓ Node.js found: $(node --version)"

echo
# Step 3: Setting up Python virtual environment
echo "Step 3: Setting up Python virtual environment..."
cd backend || exit
if [ ! -d ".venv" ]; then
    python3 -m venv .venv
    echo "✓ Virtual environment created"
else
    echo "✓ Virtual environment already exists"
fi

echo
# Step 4: Activating virtual environment and installing Python dependencies
echo "Step 4: Activating virtual environment and installing Python dependencies..."
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "Error: Failed to install Python dependencies"
    exit 1
fi
echo "✓ Python dependencies installed"

echo
# Step 5: Initializing database
echo "Step 5: Initializing database..."
python scripts/init_db.py || echo "Warning: Database initialization failed, but continuing..."
echo "✓ Database initialized"

echo
# Step 6: Building RAG vectorstore
echo "Step 6: Building RAG vectorstore..."
python scripts/ingest.py || echo "Warning: RAG vectorstore build failed, but continuing..."
echo "✓ RAG vectorstore built"

cd ..

echo
# Step 7: Installing Node.js dependencies
echo "Step 7: Installing Node.js dependencies..."
cd frontend || exit
npm install
if [ $? -ne 0 ]; then
    echo "Error: Failed to install Node.js dependencies"
    exit 1
fi
echo "✓ Node.js dependencies installed"

cd ..

echo
echo "========================================"
echo "  Setup Complete!"
echo "========================================"
echo
echo "To start the project, run: ./start.sh"
echo
echo "Backend will be available at: http://localhost:8000"
echo "Frontend will be available at: http://localhost:5173"
echo
