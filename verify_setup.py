#!/usr/bin/env python3
"""
Setup verification script for LLM Agent Chatbot
"""
import os
import sys
from pathlib import Path

def check_python_version():
    """Check Python version"""
    version = sys.version_info
    if version.major == 3 and version.minor >= 11:
        print(f"✅ Python {version.major}.{version.minor}.{version.micro} - OK")
        return True
    else:
        print(f"❌ Python {version.major}.{version.minor}.{version.micro} - Need Python 3.11+")
        return False

def check_env_file():
    """Check if .env file exists and has required variables"""
    env_path = Path(".env")
    if not env_path.exists():
        print("❌ .env file not found")
        return False
    
    print("✅ .env file exists")
    
    # Check required variables
    required_vars = ["OPENAI_API_KEY"]
    missing_vars = []
    
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        print(f"❌ Missing environment variables: {', '.join(missing_vars)}")
        return False
    
    print("✅ Required environment variables are set")
    return True

def check_dependencies():
    """Check if required packages are installed"""
    required_packages = [
        "fastapi", "uvicorn", "langchain", "openai", 
        "faiss-cpu", "duckduckgo-search", "sympy"
    ]
    
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package.replace("-", "_"))
        except ImportError:
            missing_packages.append(package)
    
    if missing_packages:
        print(f"❌ Missing packages: {', '.join(missing_packages)}")
        print("   Run: pip install -r backend/requirements.txt")
        return False
    
    print("✅ All required packages are installed")
    return False

def check_node_modules():
    """Check if Node.js dependencies are installed"""
    node_modules = Path("frontend/node_modules")
    if node_modules.exists():
        print("✅ Node.js dependencies are installed")
        return True
    else:
        print("❌ Node.js dependencies not found")
        print("   Run: cd frontend && npm install")
        return False

def check_database():
    """Check if database exists"""
    db_path = Path("backend/data/orders.db")
    if db_path.exists():
        print("✅ Database file exists")
        return True
    else:
        print("❌ Database file not found")
        print("   Run: cd backend && python scripts/init_db.py")
        return False

def check_knowledge_base():
    """Check if knowledge base files exist"""
    kb_path = Path("backend/data/kb")
    if kb_path.exists() and any(kb_path.iterdir()):
        print("✅ Knowledge base files exist")
        return True
    else:
        print("❌ Knowledge base files not found")
        return False

def main():
    """Run all setup checks"""
    print("🔍 LLM Agent Chatbot Setup Verification")
    print("=" * 50)
    
    checks = [
        ("Python Version", check_python_version),
        ("Environment File", check_env_file),
        ("Python Dependencies", check_dependencies),
        ("Node.js Dependencies", check_node_modules),
        ("Database", check_database),
        ("Knowledge Base", check_knowledge_base),
    ]
    
    passed = 0
    total = len(checks)
    
    for check_name, check_func in checks:
        print(f"\n🔍 Checking {check_name}...")
        if check_func():
            passed += 1
    
    print(f"\n📊 Setup Verification Results: {passed}/{total} checks passed")
    
    if passed == total:
        print("\n🎉 Setup is complete! You can now run the application.")
        print("\n🚀 Quick Start:")
        print("   Windows: Double-click start.bat")
        print("   PowerShell: .\\start.ps1")
        print("   Manual: Follow README_COMPLETE.md")
    else:
        print("\n⚠️  Setup is incomplete. Please fix the issues above.")
        print("\n📖 For detailed setup instructions, see README_COMPLETE.md")
    
    return 0 if passed == total else 1

if __name__ == "__main__":
    sys.exit(main())




