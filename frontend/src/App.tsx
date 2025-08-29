import { useState, useRef, useEffect } from 'react'
import Chat from './components/Chat'
import ThemeToggle from './components/ThemeToggle'
import ModernHeader from './components/ModernHeader'
import ModernSidebar from './components/ModernSidebar'
import { Download } from 'lucide-react'
import type { Message } from './lib/api'

export default function App() {
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const raw = localStorage.getItem('chat_history_v2')
      return raw ? JSON.parse(raw) as Message[] : [
        { role: 'system', content: 'You are TORQ ChatBot, an AI-powered assistant designed to help users with general inquiries, technical support, and provide information about TORQ services. You are professional, friendly, and helpful. You can assist with questions about TORQ ChatBot features, technical issues, general help, and company information. Always maintain a helpful and professional tone.' }
      ]
    } catch {
      return [{ role: 'system', content: 'You are TORQ ChatBot, an AI-powered assistant designed to help users with general inquiries, technical support, and provide information about TORQ services. You are professional, friendly, and helpful. You can assist with questions about TORQ ChatBot features, technical issues, general help, and company information. Always maintain a helpful and professional tone.' }]
    }
  })
  useEffect(()=>{
    localStorage.setItem('chat_history_v2', JSON.stringify(messages))
  },[messages])

  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="app">
      {/* Modern Header */}
      <ModernHeader 
        onToggleSidebar={toggleSidebar}
        sidebarOpen={sidebarOpen}
      />
      
      {/* App Container */}
      <div className="app-container">
        {/* Modern Sidebar */}
        <ModernSidebar 
          messages={messages}
          setMessages={setMessages}
          sidebarOpen={sidebarOpen}
        />
        
        {/* Main Content */}
        <main className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
          <Chat messages={messages} setMessages={setMessages} />
        </main>
      </div>
      
      {/* Theme Toggle */}
      <ThemeToggle />
      
      {/* Animated Developer Credit */}
      <div className="developer-credit-card">
        <div className="developer-credit-content">
          <div className="developer-name">
            Developed by <span className="highlight">Dikshant Shende</span>
          </div>
          <div className="developer-email">
            <a href="mailto:dikshantforofficial@gmail.com" className="email-link">
              dikshantforofficial@gmail.com
            </a>
          </div>
        </div>
        <div className="credit-glow"></div>
      </div>
    </div>
  )
}
