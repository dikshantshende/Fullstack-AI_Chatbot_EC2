from typing import Any, Dict, List
from langchain.tools import tool
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.agents import initialize_agent, AgentType, Tool
from .settings import settings
from . import tools as t
from .rag import retrieve


# --------------------------
# Tool Wrappers
# --------------------------

@tool
def calc(expr: str) -> str:
    """Evaluate a math expression. Use for arithmetic or numeric calculations. Arg: expr"""
    return t.calculator(expr)


@tool
def algebra(equation: str, variable: str = "x") -> str:
    """Solve algebraic equations. Provide equation and optional variable name."""
    return t.solve_equation(equation, variable)


@tool
def now_in_timezone(tz_name: str) -> str:
    """Return current local time for a given timezone, e.g., 'Asia/Kolkata'."""
    return t.timezone_now(tz_name)


@tool
def search_web(query: str) -> str:
    """Search the web and return top results with titles, urls, and snippets."""
    res = t.web_search(query, max_results=5)
    return "\n".join([f"- {r['title']} — {r['url']}\n  {r['snippet']}" for r in res])


@tool
def ask_kb(question: str) -> str:
    """Query the internal knowledge base (RAG) for company/domain-specific facts."""
    return retrieve(question, k=4)


@tool
def get_weather(city: str) -> str:
    """Get current weather summary for a city using Open-Meteo."""
    import asyncio
    return asyncio.run(t.weather(city))


@tool
def check_order_tool(order_id: str) -> str:
    """Check order status by order ID."""
    return t.check_order(order_id)


@tool
def create_ticket_tool(args: str) -> str:
    """Create a support ticket with the provided details (JSON string or plain text)."""
    return t.create_ticket(args)


# --------------------------
# LLM + Agent
# --------------------------

def get_llm():
    return ChatGoogleGenerativeAI(
        model=settings.model,
        temperature=0.7,  # More creative and conversational
        google_api_key=settings.google_api_key,
    )


def get_agent():
    llm = get_llm()
    tools = [
        Tool(name="Calculator", func=calc, description=calc.description),
        Tool(name="Algebra", func=algebra, description=algebra.description),
        Tool(name="TimezoneNow", func=now_in_timezone, description=now_in_timezone.description),
        Tool(name="WebSearch", func=search_web, description=search_web.description),
        Tool(name="AskKB", func=ask_kb, description=ask_kb.description),
        Tool(name="Weather", func=get_weather, description=get_weather.description),
        Tool(name="CheckOrder", func=check_order_tool, description=check_order_tool.description),
        Tool(name="CreateTicket", func=create_ticket_tool, description=create_ticket_tool.description),
    ]

    agent = initialize_agent(
        tools=tools,
        llm=llm,
        agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
        verbose=True,  # set to False in production
        handle_parsing_errors=True,
        max_iterations=3,  # Reduced to prevent loops
        early_stopping_method="generate",
        agent_kwargs={
            "prefix": """You are TORQ ChatBot, a professional AI customer service assistant. You are helpful, friendly, and conversational.

When users ask about checking orders, ALWAYS ask for their order ID first, then use the CheckOrder tool.
When users ask general questions, provide helpful and detailed responses.
Use tools appropriately but don't overthink - if you can answer directly, do so.

You have access to the following tools:""",
            "suffix": """Begin! Remember to be conversational, helpful, and ask for clarification when needed.

Question: {input}
Thought:{agent_scratchpad}"""
        }
    )
    return agent
