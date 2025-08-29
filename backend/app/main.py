from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from .settings import settings
from .models import ChatRequest, ChatResponse
from .agent import get_agent
from .rag import build_or_load_vectorstore
from .middleware import setup_middleware
import os
import uuid

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in settings.allow_origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup custom middleware
setup_middleware(app)

# Warm up RAG store on startup
@app.on_event("startup")
async def startup_event():
    try:
        build_or_load_vectorstore()
        print("Vectorstore initialized successfully")
    except Exception as e:
        print(f"Vectorstore build error: {e}")

@app.get("/api/health")
def health():
    return {"status": "ok", "app": settings.app_name}

@app.post("/api/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    if not settings.google_api_key:
        raise HTTPException(status_code=500, detail="GOOGLE_API_KEY not configured")
    
    try:
        agent = get_agent()
        # Compose messages with improved system prompt
        system = ("You are TORQ ChatBot, a professional AI customer service assistant. "
                  "You are helpful, friendly, and knowledgeable about customer service topics. "
                  "When users ask about orders, always ask for their order ID first before using CheckOrder tool. "
                  "When users need help, provide detailed and realistic responses. "
                  "Use tools when appropriate: WebSearch for current info, AskKB for company policies, "
                  "Weather for weather queries, Calculator for math, CheckOrder for order status, "
                  "CreateTicket for support issues. Always be conversational and helpful.")
        messages = [ {"role": "system", "content": system} ] + [m.model_dump() for m in req.messages]
        
        # LangChain agent expects plain string input; pass last user content
        last_user = next((m["content"] for m in reversed(messages) if m["role"] in ("user","human")), "")
        result = agent.run(last_user)
        return ChatResponse(output=result, tool_calls=[])
    except Exception as e:
        print(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    """Upload a file and return file info"""
    try:
        # Create uploads directory if it doesn't exist
        upload_dir = "data/uploads"
        os.makedirs(upload_dir, exist_ok=True)
        
        # Generate unique filename
        file_extension = os.path.splitext(file.filename)[1] if file.filename else ""
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = os.path.join(upload_dir, unique_filename)
        
        # Save file
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        return {
            "filename": file.filename,
            "size": len(content),
            "type": file.content_type,
            "path": file_path,
            "message": f"File '{file.filename}' uploaded successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")
