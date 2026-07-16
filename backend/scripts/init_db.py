#!/usr/bin/env python3
"""
Database initialization script for orders and tickets
"""
import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).resolve().parents[1] / "data" / "orders.db"

def init_database():
    """Initialize the database with tables and sample data"""
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    
    # Create orders table
    cur.execute("""
        CREATE TABLE IF NOT EXISTS orders (
            id TEXT PRIMARY KEY,
            customer_name TEXT NOT NULL,
            item TEXT NOT NULL,
            status TEXT NOT NULL,
            estimated_delivery TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    # Create tickets table
    cur.execute("""
        CREATE TABLE IF NOT EXISTS tickets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id TEXT NOT NULL,
            issue TEXT NOT NULL,
            status TEXT DEFAULT 'open',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (order_id) REFERENCES orders (id)
        )
    """)
    
    # Insert sample orders
    sample_orders = [
        ("ORD101", "John Smith", "Wireless Headphones", "shipped", "2024-01-15"),
        ("ORD102", "Sarah Johnson", "Smart Watch", "processing", "2024-01-20"),
        ("ORD103", "Mike Davis", "Bluetooth Speaker", "delivered", "2024-01-10"),
        ("ORD104", "Lisa Wilson", "Phone Case", "pending", "2024-01-25"),
        ("ORD105", "Tom Brown", "USB Cable", "shipped", "2024-01-18"),
    ]
    
    cur.executemany(
        "INSERT OR REPLACE INTO orders (id, customer_name, item, status, estimated_delivery) VALUES (?, ?, ?, ?, ?)",
        sample_orders
    )
    
    conn.commit()
    conn.close()
    print(f"Database initialized at {DB_PATH}")
    print("Sample orders created: ORD101, ORD102, ORD103, ORD104, ORD105")

if __name__ == "__main__":
    init_database()

