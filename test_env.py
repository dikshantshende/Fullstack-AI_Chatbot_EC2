#!/usr/bin/env python3
"""
Simple environment variable test
"""
import os
from pathlib import Path
from dotenv import load_dotenv

print("🔍 Testing Environment Variables")
print("=" * 40)

# Check current directory
print(f"Current directory: {os.getcwd()}")

# Find .env file
env_path = Path(".env")
print(f".env file exists: {env_path.exists()}")
print(f".env file path: {env_path.absolute()}")

if env_path.exists():
    # Load .env file
    load_dotenv(env_path)
    
    # Check API key
    api_key = os.getenv("OPENAI_API_KEY")
    if api_key:
        print(f"✅ API Key loaded: {api_key[:20]}...{api_key[-4:]}")
        print(f"   Length: {len(api_key)} characters")
    else:
        print("❌ API Key not loaded")
    
    # Check other variables
    print(f"Model: {os.getenv('OPENAI_MODEL', 'NOT SET')}")
    print(f"Debug: {os.getenv('DEBUG', 'NOT SET')}")
else:
    print("❌ .env file not found in current directory")
    
    # Try to find it in parent directories
    current = Path.cwd()
    while current != current.parent:
        parent_env = current / ".env"
        if parent_env.exists():
            print(f"✅ Found .env in parent: {parent_env}")
            load_dotenv(parent_env)
            api_key = os.getenv("OPENAI_API_KEY")
            if api_key:
                print(f"✅ API Key loaded from parent: {api_key[:20]}...{api_key[-4:]}")
            break
        current = current.parent
    else:
        print("❌ No .env file found in any parent directory")

print("=" * 40)




