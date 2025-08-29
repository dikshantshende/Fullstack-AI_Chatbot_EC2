#!/bin/bash

echo "========================================"
echo "  LLM Agent Chatbot - Project Setup"
echo "========================================"
echo

# Step 1: Check Python installation
echo "Step 1: Checking Python installation..."
if ! command -v python3 &> /dev/null
then
    echo "Error: Python is not installed. Please install Python 3.8+."
    exit 1
fi
echo "✓ Python found"

echo
# Step 2: Check Node.js installation
echo "Step 2: Checking Node.js installation..."
if ! command -v node &> /dev/null
then
    echo "Error: Node.js is not installed. Please install Node.js 18+."
    exit 1
fi
echo "✓ Node.js found"

echo
# Step 3: Setup Python virtual environment
echo "Step 3: Setting up Python virtual environment..."
cd backend || exit
if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo "✓ Virtual environment created"
else
    echo "✓ Virtual environment already exists"
fi

echo
# Step 4: Activate venv and install Python dependencies
echo "Step 4: Installing Python dependencies..."
source venv/bin/activate
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "Error: Failed to install Python dependencies"
    exit 1
fi
echo "✓ Python dependencies installed"

echo
# Step 5: Initialize database
echo "Step 5: Initializing database..."
python3 scripts/init_db.py || echo "Warning: Database initialization failed, continuing..."
echo "✓ Database initialized"

echo
# Step 6: Build RAG vectorstore
echo "Step 6: Building RAG vectorstore..."
python3 scripts/ingest.py || echo "Warning: RAG vectorstore build failed, continuing..."
echo "✓ RAG vectorstore built"

cd ..

echo
# Step 7: Install Node.js dependencies
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
echo "Backend will be available at: http://localhost:8000"
echo "Frontend will be available at: http://localhost:5173"
