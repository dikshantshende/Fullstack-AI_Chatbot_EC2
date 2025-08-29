"""
Utility functions for the application
"""
import re
from typing import Optional
from datetime import datetime

def validate_order_id(order_id: str) -> bool:
    """Validate order ID format (ORD followed by numbers)"""
    return bool(re.match(r'^ORD\d+$', order_id))

def sanitize_input(text: str) -> str:
    """Basic input sanitization"""
    if not text:
        return ""
    # Remove potentially dangerous characters
    return re.sub(r'[<>"\']', '', text.strip())

def format_timestamp(timestamp: Optional[datetime] = None) -> str:
    """Format timestamp for display"""
    if timestamp is None:
        timestamp = datetime.now()
    return timestamp.strftime("%Y-%m-%d %H:%M:%S")

def truncate_text(text: str, max_length: int = 100) -> str:
    """Truncate text to specified length"""
    if len(text) <= max_length:
        return text
    return text[:max_length-3] + "..."

def parse_ticket_args(args: str) -> tuple[str, str]:
    """Parse ticket creation arguments (order_id | issue)"""
    if "|" in args:
        parts = args.split("|", 1)
        order_id = parts[0].strip()
        issue = parts[1].strip()
    else:
        # Try to extract order ID from the text
        order_match = re.search(r'ORD\d+', args)
        order_id = order_match.group(0) if order_match else ""
        issue = args.replace(order_id, "").strip(" |")
    
    return order_id, issue

