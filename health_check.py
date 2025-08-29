#!/usr/bin/env python3
"""
Health check script for the LLM Agent Chatbot
"""
import requests
import time
import sys

def check_backend():
    """Check if backend is running"""
    try:
        response = requests.get("http://localhost:8000/api/health", timeout=5)
        if response.status_code == 200:
            print("✅ Backend is running")
            return True
        else:
            print(f"❌ Backend returned status {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Backend is not accessible: {e}")
        return False

def check_frontend():
    """Check if frontend is running"""
    try:
        response = requests.get("http://localhost:5173", timeout=5)
        if response.status_code == 200:
            print("✅ Frontend is running")
            return True
        else:
            print(f"❌ Frontend returned status {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Frontend is not accessible: {e}")
        return False

def test_chat():
    """Test the chat functionality"""
    try:
        response = requests.post(
            "http://localhost:8000/api/chat",
            json={
                "messages": [
                    {"role": "user", "content": "What is 2 + 2?"}
                ]
            },
            timeout=30
        )
        if response.status_code == 200:
            data = response.json()
            print("✅ Chat API is working")
            print(f"   Response: {data.get('output', 'No output')[:100]}...")
            return True
        else:
            print(f"❌ Chat API returned status {response.status_code}")
            print(f"   Error: {response.text}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Chat API test failed: {e}")
        return False

def main():
    """Run all health checks"""
    print("🏥 Health Check for LLM Agent Chatbot")
    print("=" * 50)
    
    checks = [
        ("Backend", check_backend),
        ("Frontend", check_frontend),
        ("Chat API", test_chat),
    ]
    
    passed = 0
    total = len(checks)
    
    for check_name, check_func in checks:
        print(f"\n🔍 Checking {check_name}...")
        if check_func():
            passed += 1
        time.sleep(1)  # Small delay between checks
    
    print(f"\n📊 Health Check Results: {passed}/{total} checks passed")
    
    if passed == total:
        print("🎉 All systems are healthy!")
        return 0
    else:
        print("⚠️  Some systems are not healthy. Check the errors above.")
        return 1

if __name__ == "__main__":
    sys.exit(main())




