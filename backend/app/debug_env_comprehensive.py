#!/usr/bin/env python3
"""
Comprehensive environment variable debug script
"""
import os
from pathlib import Path
from dotenv import load_dotenv

print("🔍 Comprehensive Environment Variable Debug")
print("=" * 60)

# Check current working directory
print(f"📂 Current working directory: {os.getcwd()}")

# Find the .env file in the project root
env_path = Path(__file__).resolve().parents[2] / '.env'
print(f"\n📁 .env file path: {env_path}")
print(f"📁 .env file exists: {env_path.exists()}")

# Check if .env file exists and read its contents
if env_path.exists():
    print(f"\n📄 .env file contents:")
    try:
        with open(env_path, 'r', encoding='utf-8') as f:
            content = f.read()
            lines = content.split('\n')
            for i, line in enumerate(lines, 1):
                if line.strip() and not line.strip().startswith('#'):
                    # Hide the actual API key value for security
                    if 'OPENAI_API_KEY' in line:
                        parts = line.split('=', 1)
                        if len(parts) == 2:
                            key_name = parts[0]
                            key_value = parts[1]
                            masked_value = key_value[:10] + "..." + key_value[-4:] if len(key_value) > 14 else "***"
                            print(f"   Line {i}: {key_name}={masked_value}")
                    else:
                        print(f"   Line {i}: {line}")
    except Exception as e:
        print(f"   ❌ Error reading .env file: {e}")
else:
    print("   ❌ .env file not found!")

# Check system environment variables
print(f"\n🔑 System Environment Variables:")
print(f"OPENAI_API_KEY: {'✅ SET' if os.environ.get('OPENAI_API_KEY') else '❌ NOT SET'}")
print(f"OPENAI_MODEL: {'✅ SET' if os.environ.get('OPENAI_MODEL') else '❌ NOT SET'}")
print(f"DEBUG: {'✅ SET' if os.environ.get('DEBUG') else '❌ NOT SET'}")

# Load .env file
print(f"\n📥 Loading .env file...")
load_dotenv(env_path)

# Check environment variables after loading
print(f"\n🔑 Environment Variables After Loading .env:")
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
print(f"CORS_ALLOW_ORIGINS: {os.getenv('CORS_ALLOW_ORIGINS', '❌ NOT SET')}")
print(f"VECTOR_PATH: {os.getenv('VECTOR_PATH', '❌ NOT SET')}")
print(f"KB_PATH: {os.getenv('KB_PATH', '❌ NOT SET')}")
print(f"SEARCH_SAFE: {os.getenv('SEARCH_SAFE', '❌ NOT SET')}")

# Check if there are any hidden characters in the .env file
if env_path.exists():
    print(f"\n🔍 Checking for hidden characters in .env:")
    try:
        with open(env_path, 'rb') as f:
            raw_content = f.read()
            print(f"   File size: {len(raw_content)} bytes")
            bom_bytes = b'\xef\xbb\xbf'
            crlf_bytes = b'\r\n'
            null_bytes = b'\x00'
            print(f"   Contains BOM: {raw_content.startswith(bom_bytes)}")
            print(f"   Contains carriage returns: {crlf_bytes in raw_content}")
            print(f"   Contains null bytes: {null_bytes in raw_content}")
    except Exception as e:
        print(f"   ❌ Error reading raw .env file: {e}")

print("\n" + "=" * 60)
