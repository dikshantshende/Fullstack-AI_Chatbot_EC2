#!/bin/bash

# LLM Agent Chatbot Service Management Script

case "$1" in
    start)
        echo "🚀 Starting LLM Agent Chatbot services..."
        
        # Start backend
        cd /home/ubuntu/project/backend
        nohup .venv/bin/python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 > backend.log 2>&1 &
        echo "✅ Backend started (logs: backend/backend.log)"
        
        # Start frontend
        cd /home/ubuntu/project/frontend
        nohup npm run dev -- --host 0.0.0.0 > frontend.log 2>&1 &
        echo "✅ Frontend started (logs: frontend/frontend.log)"
        
        sleep 3
        echo ""
        echo "🌐 Your chatbot is now running at:"
        echo "   Frontend: http://16.16.207.191:5173"
        echo "   Backend:  http://16.16.207.191:8000"
        ;;
        
    stop)
        echo "🛑 Stopping LLM Agent Chatbot services..."
        pkill -f "uvicorn app.main:app"
        pkill -f "npm run dev"
        echo "✅ All services stopped"
        ;;
        
    status)
        echo "📊 Service Status:"
        echo ""
        
        # Check backend
        if pgrep -f "uvicorn app.main:app" > /dev/null; then
            echo "✅ Backend: RUNNING (port 8000)"
        else
            echo "❌ Backend: STOPPED"
        fi
        
        # Check frontend
        if pgrep -f "npm run dev" > /dev/null; then
            echo "✅ Frontend: RUNNING (port 5173)"
        else
            echo "❌ Frontend: STOPPED"
        fi
        
        echo ""
        echo "🌐 Access URLs:"
        echo "   Frontend: http://16.16.207.191:5173"
        echo "   Backend:  http://16.16.207.191:8000"
        ;;
        
    restart)
        echo "🔄 Restarting LLM Agent Chatbot services..."
        $0 stop
        sleep 2
        $0 start
        ;;
        
    logs)
        echo "📋 Recent logs:"
        echo ""
        echo "=== Backend Logs ==="
        tail -20 /home/ubuntu/project/backend/backend.log 2>/dev/null || echo "No backend logs found"
        echo ""
        echo "=== Frontend Logs ==="
        tail -20 /home/ubuntu/project/frontend/frontend.log 2>/dev/null || echo "No frontend logs found"
        ;;
        
    *)
        echo "🤖 LLM Agent Chatbot Service Manager"
        echo ""
        echo "Usage: $0 {start|stop|restart|status|logs}"
        echo ""
        echo "Commands:"
        echo "  start   - Start both frontend and backend services"
        echo "  stop    - Stop all services"
        echo "  restart - Restart all services"
        echo "  status  - Show current service status"
        echo "  logs    - Show recent logs from both services"
        echo ""
        echo "Services will keep running even if you disconnect from SSH!"
        ;;
esac