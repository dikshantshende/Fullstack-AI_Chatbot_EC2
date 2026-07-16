# 🚀 LLM Agent Chatbot - Complete Working Project

A production-ready, multi-tool LLM agent with a clean UI and RAG knowledge base.

## ✨ Features

- **🤖 Multi-Tool AI Agent**: Calculator, Algebra, Timezone, Web Search, Weather, RAG
- **📚 RAG Knowledge Base**: Company policies, FAQs, shipping info
- **🛒 Order Management**: Check order status, create support tickets
- **🌐 Modern UI**: React + TypeScript + Tailwind CSS
- **🔧 FastAPI Backend**: Python backend with LangChain integration
- **🐳 Docker Ready**: Full containerization support

## 🏗️ Project Structure

```
llm-agent-chatbot-v2/
├── backend/                    # Python FastAPI backend
│   ├── app/
│   │   ├── main.py           # FastAPI application
│   │   ├── agent.py          # LangChain agent setup
│   │   ├── tools.py          # Tool implementations
│   │   ├── rag.py            # RAG functionality
│   │   ├── models.py         # Pydantic models
│   │   ├── settings.py       # Configuration
│   │   ├── middleware.py     # Custom middleware
│   │   └── utils.py          # Utility functions
│   ├── data/
│   │   ├── kb/               # Knowledge base files
│   │   ├── orders.db         # SQLite database
│   │   └── vectorstore/      # FAISS vectors
│   ├── scripts/
│   │   ├── init_db.py        # Database setup
│   │   └── ingest.py         # RAG ingestion
│   ├── requirements.txt      # Python dependencies
│   ├── Dockerfile            # Container config
│   └── test_basic.py         # Basic tests
├── frontend/                  # React frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── lib/              # API utilities
│   │   └── styles.css        # Global styles
│   ├── package.json          # Node dependencies
│   ├── vite.config.ts        # Vite configuration
│   ├── tailwind.config.js    # Tailwind CSS
│   ├── postcss.config.js     # PostCSS
│   ├── tsconfig.json         # TypeScript
│   └── tsconfig.node.json    # Node TypeScript
├── docker-compose.yml         # Container orchestration
├── start.bat                  # Windows startup script
├── start.ps1                  # PowerShell startup script
└── README_COMPLETE.md         # This file
```

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- Google Api key

### 1. Environment Setup
Create a `.env` file in the project root:
```env
GOOGLE_API_KEY="your_api_key_here"
GEMINI_MODEL=gemini-1.5-flash
DEBUG=false
CORS_ALLOW_ORIGINS=*
VECTOR_PATH=data/vectorstore
KB_PATH=data/kb
SEARCH_SAFE=moderate
```

### 2. Easy Startup (Windows)
```bash
# Double-click start.bat or run:
start.bat
```

### 3. Easy Startup (PowerShell)
```powershell
# Run PowerShell as Administrator, then:
.\start.ps1
```

### 4. Manual Startup
```bash
# Backend
cd backend
pip install -r requirements.txt
python scripts/init_db.py
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

### 5. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **Health Check**: http://localhost:8000/api/health

## 🧪 Testing

### Run Basic Tests
```bash
cd backend
python test_basic.py
```

### Test API Endpoints
```bash
# Health check
curl http://localhost:8000/api/health

# Chat endpoint
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "What is 15 * 23?"}]}'
```

## 🎯 Example Prompts

Try these in the chat interface:

### Math & Calculations
- "What's 15 * 23?"
- "Solve 2x + 5 = 13"
- "Calculate the square root of 144"

### Time & Weather
- "What time is it in Tokyo?"
- "What's the weather in London?"
- "Current time in New York"

### Orders & Support
- "Check status of order ORD101"
- "Create a ticket for ORD103 | My speaker arrived damaged"
- "What's the return policy?"

### Web Search
- "Search for latest AI news"
- "Find information about Python programming"

## 🛠️ Available Tools

| Tool | Description | Example |
|------|-------------|---------|
| **Calculator** | Math expressions | `15 * 23 + 7` |
| **Algebra** | Solve equations | `2x + 5 = 13` |
| **Timezone** | Current time | `Asia/Kolkata` |
| **WebSearch** | Internet search | `latest AI news` |
| **Weather** | City weather | `London weather` |
| **AskKB** | Company knowledge | `return policy` |
| **CheckOrder** | Order status | `ORD101` |
| **CreateTicket** | Support ticket | `ORD103 | damaged item` |

## 🔧 Configuration

### Environment Variables
- `Google_API_KEY`: Your Google API key (required)
- `OPENAI_MODEL`: Model to use (default: gpt-4o-mini)
- `DEBUG`: Enable debug mode (default: false)
- `PORT`: Backend port (default: 8000)
- `CORS_ALLOW_ORIGINS`: CORS origins (default: *)

### Customization
- **Add new tools**: Edit `backend/app/tools.py`
- **Modify knowledge base**: Add files to `backend/data/kb/`
- **Change UI**: Edit React components in `frontend/src/`

## 🐳 Docker Deployment

### Build and Run
```bash
docker compose up --build
```

### Production
```bash
docker compose -f docker-compose.prod.yml up -d
```

## 📊 Database Schema

### Orders Table
```sql
CREATE TABLE orders (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    item TEXT NOT NULL,
    status TEXT NOT NULL,
    estimated_delivery TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tickets Table
```sql
CREATE TABLE tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id TEXT NOT NULL,
    issue TEXT NOT NULL,
    status TEXT DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders (id)
);
```

## 🚨 Troubleshooting

### Common Issues

1. **API Key Error (401)**
   - Verify `.env` file exists and has correct API key
   - Check API key has sufficient credits
   - Restart backend server after changing `.env`

2. **Database Errors**
   - Run `python scripts/init_db.py` to recreate database
   - Check file permissions on `data/` directory

3. **Port Already in Use**
   - Change ports in `.env` or kill existing processes
   - Windows: `netstat -ano | findstr :8000`

4. **Module Import Errors**
   - Install dependencies: `pip install -r requirements.txt`
   - Check Python version (3.11+)

5. **Frontend Build Errors**
   - Install Node dependencies: `npm install`
   - Check Node.js version (18+)

### Debug Mode
Enable debug mode in `.env`:
```env
DEBUG=true
```

### Logs
- **Backend**: Check terminal output
- **Frontend**: Check browser console
- **Docker**: `docker compose logs -f`

## 🔒 Security Features

- Input sanitization
- CORS configuration
- Rate limiting (via middleware)
- SQL injection protection
- XSS prevention

## 📈 Performance

- **RAG**: FAISS vector store with local fallback
- **Caching**: Vector store persistence
- **Async**: Non-blocking API calls
- **Optimized**: Efficient text splitting and retrieval

## 🚀 Next Steps

### Immediate Improvements
- [ ] Add authentication (Clerk/Auth0)
- [ ] Implement streaming responses
- [ ] Add file upload capabilities
- [ ] Set up monitoring and logging

### Advanced Features
- [ ] Multi-tenant support
- [ ] Advanced analytics
- [ ] Custom tool creation
- [ ] Integration APIs

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Run the test suite: `python test_basic.py`
3. Check logs for error messages
4. Verify environment configuration

## 📄 License



---

**🎉 Your LLM Agent Chatbot is now ready to use!**

Start with `start.bat` (Windows) or `start.ps1` (PowerShell) for the easiest experience.




