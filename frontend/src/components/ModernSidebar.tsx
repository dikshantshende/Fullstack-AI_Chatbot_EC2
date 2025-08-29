import { Download, Trash2, Plus, Search, History, Star, MessageSquare, FileText, Settings, HelpCircle } from 'lucide-react'
import { useState } from 'react'
import type { Message } from '../lib/api'

interface ModernSidebarProps {
  messages: Message[]
  setMessages: (messages: Message[]) => void
  sidebarOpen: boolean
}

export default function ModernSidebar({ messages, setMessages, sidebarOpen }: ModernSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState<'conversations' | 'tools' | 'settings'>('conversations')

  const exportChat = () => {
    const chatData = {
      exportDate: new Date().toISOString(),
      totalMessages: messages.length,
      messages: messages.filter(m => m.role !== 'system')
    }
    
    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chat-export-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const clearChat = () => {
    localStorage.removeItem('chat_history_v2')
    setMessages([])
  }

  const filteredMessages = messages.filter(m => 
    m.role !== 'system' && 
    m.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const tools = [
    { name: 'General Help', icon: '❓', color: 'bg-blue-500', desc: 'Get general assistance', action: 'I need general help' },
    { name: 'FAQ', icon: '📋', color: 'bg-green-500', desc: 'Frequently asked questions', action: 'What are your frequently asked questions?' },
    { name: 'Technical Support', icon: '🔧', color: 'bg-purple-500', desc: 'Technical issues & help', action: 'I need technical support' },
    { name: 'Live Chat', icon: '💬', color: 'bg-orange-500', desc: 'Connect with human agent', action: 'I want to speak with a human agent' },
    { name: 'Contact Info', icon: '📞', color: 'bg-red-500', desc: 'Contact information', action: 'What is your contact information?' },
    { name: 'About Us', icon: 'ℹ️', color: 'bg-indigo-500', desc: 'Company information', action: 'Tell me about TORQ ChatBot' },
    { name: 'Privacy Policy', icon: '🔒', color: 'bg-teal-500', desc: 'Privacy & data protection', action: 'What is your privacy policy?' },
    { name: 'Terms of Service', icon: '📄', color: 'bg-pink-500', desc: 'Terms & conditions', action: 'What are your terms of service?' },
  ]

  const handleToolClick = (action: string) => {
    // Add the tool action as a user message
    const newMessage = { role: 'user' as const, content: action }
    setMessages([...messages, newMessage])
  }

  return (
    <div className={`modern-sidebar ${sidebarOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <h2 className="sidebar-title">TORQ ChatBot</h2>
        <p className="sidebar-subtitle">AI-Powered Assistant</p>
      </div>
      
      <div className="sidebar-content">
        <div className="sidebar-section">
          <div className="sidebar-section-title">
            Quick Actions
          </div>
          <div className="space-y-2">
            {tools.map((tool, index) => (
              <div
                key={index}
                onClick={() => handleToolClick(tool.action)}
                className="sidebar-nav-link flex items-center gap-3 p-3"
              >
                <div className={`w-8 h-8 rounded-lg ${tool.color} flex items-center justify-center text-white text-sm flex-shrink-0`}>
                  {tool.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-medium truncate">{tool.name}</h4>
                  <p className="text-xs opacity-80 truncate">{tool.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-section-title">
            Chat History
          </div>
          <div className="space-y-2">
            {filteredMessages.slice(-5).map((m, i) => (
              <div
                key={i}
                className="sidebar-nav-link p-3"
                onClick={() => setMessages(messages.slice(0, messages.indexOf(m) + 1))}
              >
                <div className="flex items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium opacity-80 uppercase">
                        {m.role}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(m.timestamp || Date.now()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    <p className="text-sm truncate leading-tight">
                      {m.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-section-title">
            Actions
          </div>
          <div className="space-y-2">
            <button
              onClick={exportChat}
              className="sidebar-nav-link"
              title="Export chat"
            >
              <Download className="w-4 h-4" />
              Export Chat
            </button>
            <button
              onClick={clearChat}
              className="sidebar-nav-link"
              title="Clear all"
            >
              <Trash2 className="w-4 h-4" />
              Clear Chat
            </button>
            <button
              onClick={() => {
                setMessages([
                  { role: 'system', content: 'You are TORQ ChatBot, an AI-powered assistant designed to help users with general inquiries, technical support, and provide information about TORQ services. You are professional, friendly, and helpful. You can assist with questions about TORQ ChatBot features, technical issues, general help, and company information. Always maintain a helpful and professional tone.' }
                ])
              }}
              className="sidebar-nav-link"
            >
              <Plus className="w-4 h-4" />
              New Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
