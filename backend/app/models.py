from pydantic import BaseModel, Field
from typing import Optional, List, Any, Dict

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    output: str
    tool_calls: Optional[List[Dict[str, Any]]] = None

class ToolCall(BaseModel):
    name: str
    args: Dict[str, Any] = Field(default_factory=dict)
