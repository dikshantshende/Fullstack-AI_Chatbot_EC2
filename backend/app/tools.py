import math
import time
from datetime import datetime
import pytz
from typing import Any, Dict, List
import httpx
from duckduckgo_search import DDGS
from sympy import sympify, Eq, Symbol, solve as sym_solve

from .settings import settings

# Calculator using a safe subset via sympy
def calculator(expr: str) -> str:
    try:
        node = sympify(expr)
        result = node.evalf()
        return str(result)
    except Exception as e:
        return f"Error evaluating expression: {e}"

# Algebra solver: solve for x unless specified
def solve_equation(equation: str, variable: str = "x") -> str:
    try:
        if "=" in equation:
            left, right = equation.split("=", 1)
            eq = Eq(sympify(left), sympify(right))
        else:
            eq = Eq(sympify(equation), 0)
        var = Symbol(variable)
        sol = sym_solve(eq, var)
        return f"Solutions for {variable}: {sol}"
    except Exception as e:
        return f"Error solving equation: {e}"

# Timezone response
def timezone_now(tz_name: str) -> str:
    try:
        tz = pytz.timezone(tz_name)
    except Exception:
        return "Invalid timezone. Try e.g., 'Asia/Kolkata', 'America/New_York', 'Europe/London'."
    now = datetime.now(tz)
    return now.strftime("%Y-%m-%d %H:%M:%S %Z%z")

# DuckDuckGo web search
def web_search(query: str, max_results: int = 5) -> List[Dict[str, Any]]:
    results = []
    with DDGS() as ddgs:
        for r in ddgs.text(query, max_results=max_results, safesearch=settings.search_safe):
            # r has keys: title, href, body
            results.append({"title": r.get("title"), "url": r.get("href"), "snippet": r.get("body")})
    return results

# Weather via Open-Meteo (no API key needed)
async def weather(city: str) -> str:
    async with httpx.AsyncClient(timeout=20) as client:
        geo = await client.get(settings.weather_geocode_url, params={"name": city, "count": 1})
        geo.raise_for_status()
        data = geo.json()
        if not data.get("results"):
            return f"Could not geocode '{city}'."
        place = data["results"][0]
        lat, lon = place["latitude"], place["longitude"]
        w = await client.get(settings.weather_api_url, params={"latitude": lat, "longitude": lon, "hourly": "temperature_2m,relative_humidity_2m,precipitation_probability", "current_weather": True})
        w.raise_for_status()
        wd = w.json()
        cw = wd.get("current_weather", {})
        temp = cw.get("temperature")
        wind = cw.get("windspeed")
        summary = f"Weather for {place['name']}, {place.get('country_code','')} (lat {lat}, lon {lon}): current temperature {temp}°C, wind {wind} km/h."
        return summary



# --- Orders & Tickets (SQLite) ---
import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).resolve().parents[1] / "data" / "orders.db"

def _db_conn():
    return sqlite3.connect(DB_PATH)

def check_order(order_id: str) -> str:
    try:
        conn = _db_conn()
        cur = conn.cursor()
        cur.execute("SELECT id, customer_name, item, status, estimated_delivery FROM orders WHERE id = ?", (order_id,))
        row = cur.fetchone()
        conn.close()
        if not row:
            return f"No order found with ID {order_id}. Please check the ID."
        oid, name, item, status, eta = row
        return f"Order {oid} for {name}: item='{item}', status='{status}', estimated_delivery='{eta}'."
    except Exception as e:
        return f"Error checking order: {e}"

def create_ticket(args: str) -> str:
    """Create a support ticket with order_id and issue description"""
    try:
        from .utils import parse_ticket_args, validate_order_id, sanitize_input
        
        order_id, issue = parse_ticket_args(args)
        
        if not order_id:
            return "Please provide an order ID (e.g., ORD101) to create a ticket."
        
        if not validate_order_id(order_id):
            return f"Invalid order ID format: {order_id}. Use format ORD followed by numbers (e.g., ORD101)."
        
        if not issue:
            return "Please provide a description of the issue."
        
        # Sanitize inputs
        order_id = sanitize_input(order_id)
        issue = sanitize_input(issue)
        
        conn = _db_conn()
        cur = conn.cursor()
        
        # Verify order exists
        cur.execute("SELECT id FROM orders WHERE id = ?", (order_id,))
        if not cur.fetchone():
            return f"Cannot create ticket: order {order_id} not found."
        
        cur.execute("INSERT INTO tickets (order_id, issue) VALUES (?,?)", (order_id, issue))
        conn.commit()
        ticket_id = cur.lastrowid
        conn.close()
        
        return f"Ticket created: #{ticket_id} for order {order_id}. Issue: {issue}"
    except Exception as e:
        return f"Error creating ticket: {e}"
