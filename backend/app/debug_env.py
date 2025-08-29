#!/usr/bin/env python3
"""
Debug script to check environment variable loading
"""
import os
from dotenv import load_dotenv

print("🔍 Environment Variable Debug Script")
print("=" * 50)

# Check if .env file exists
env_path = os.path.join(os.path.dirname(__file__), '..', '..', '.env')
print(f"📁 Looking for .env file at: {env_path}")
print(f"📁 .env file exists: {os.path.exists(env_path)}")

# Load .env file
print("\n📥 Loading .env file...")
load_dotenv(env_path)

# Check key environment variables
print("\n🔑 Environment Variables:")
print(f"OPENAI_API_KEY: {'✅ SET' if os.getenv('OPENAI_API_KEY') else '❌ NOT SET'}")
if os.getenv('OPENAI_API_KEY'):
    key = os.getenv('OPENAI_API_KEY')
    print(f"   Key length: {len(key)} characters")
    print(f"   Key starts with: {key[:10]}...")
    print(f"   Key ends with: ...{key[-4:]}")
else:
    print("   ❌ No API key found!")

print(f"OPENAI_MODEL: {os.getenv('OPENAI_MODEL', '❌ NOT SET')}")
print(f"DEBUG: {os.getenv('DEBUG', '❌ NOT SET')}")
print(f"PORT: {os.getenv('PORT', '❌ NOT SET')}")

# Check current working directory
print(f"\n📂 Current working directory: {os.getcwd()}")

# Check if we can find the .env file from current location
print(f"\n🔍 Searching for .env from current location:")
current_dir = os.getcwd()
while current_dir != os.path.dirname(current_dir):
    env_file = os.path.join(current_dir, '.env')
    if os.path.exists(env_file):
        print(f"   ✅ Found .env at: {env_file}")
        break
    current_dir = os.path.dirname(current_dir)
else:
    print("   ❌ No .env file found in parent directories")

print("\n" + "=" * 50)
