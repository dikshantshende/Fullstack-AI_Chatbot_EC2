import { useState, useEffect } from 'react'
import Chat from './components/Chat'
import ThemeToggle from './components/ThemeToggle'
import ModernHeader from './components/ModernHeader'
import ModernSidebar from './components/ModernSidebar'
import Auth from './components/Auth'
import { supabase } from './lib/supabase'
import type { Message } from './lib/api'
import type { Session } from '@supabase/supabase-js'

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

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

  if (!session) {
    return (
      <div className="app">
        <Auth />
        <ThemeToggle />
      </div>
    )
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
