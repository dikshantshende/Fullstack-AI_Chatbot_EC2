#!/usr/bin/env bash
set -e

echo "Building frontend..."
cd frontend
npm install
npm run build
cd ..

echo "Building backend..."
cd backend
python -m pip install --upgrade pip
pip install -r requirements.txt

echo "Initializing database..."
python scripts/init_db.py
echo "Build complete."
