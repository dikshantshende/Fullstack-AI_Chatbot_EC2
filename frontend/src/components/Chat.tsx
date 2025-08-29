import { useEffect, useRef, useState } from 'react'
import Message from './Message'
import ModernMessage from './ModernMessage'
import ModernChatInput from './ModernChatInput'
import ToolIndicator from './ToolIndicator'
import QuickActions from './QuickActions'
import WelcomeMessage from './WelcomeMessage'
import { chat, healthCheck, type Message as Msg } from '../lib/api'

// Sound notification function
const playNotificationSound = () => {
  try {
    // Create a simple notification sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1)
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.3)
  } catch (error) {
    console.log('Sound notification not available')
  }
}

export default function Chat({ messages, setMessages }:{messages:Msg[], setMessages:(m:Msg[])=>void}) {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [responseTime, setResponseTime] = useState<number | undefined>(undefined)
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking')
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(()=>{
    bottomRef.current?.scrollIntoView({behavior:'smooth'})
  },[messages, loading])

  // Check API connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        await healthCheck()
        setConnectionStatus('connected')
      } catch (error) {
        console.error('API connection failed:', error)
        setConnectionStatus('disconnected')
      }
    }
    
    checkConnection()
    
    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000)
    return () => clearInterval(interval)
  }, [])

  async function onSend(message: string) {
    if (!message.trim() || loading) return
    
    // Check connection before sending
    if (connectionStatus === 'disconnected') {
      setMessages([...messages,
        { role:'user' as const, content: message.trim() },
        { role:'assistant', content: 'Error: Unable to connect to the server. Please check your connection and try again.' }
      ])
      return
    }
    
    const next = [...messages, { role:'user' as const, content: message.trim(), timestamp: Date.now() }]
    setMessages(next)
    setInput('')
    setLoading(true)
    setIsTyping(true)
    setResponseTime(undefined)
    
    // Simulate realistic typing delay
    setTimeout(() => setIsTyping(false), 1000 + Math.random() * 2000)
    
    const startTime = Date.now()
    try {
      const res = await chat(next)
      const endTime = Date.now()
      setResponseTime(endTime - startTime)
      setConnectionStatus('connected')
      setMessages([...next, {
        role:'assistant',
        content: res.output,
        timestamp: Date.now()
      }])
      
      // Play notification sound for new assistant message
      playNotificationSound()
    } catch (err:any) {
      const endTime = Date.now()
      setResponseTime(endTime - startTime)
      setConnectionStatus('disconnected')
      
      let errorMessage = 'Error: '
      if (err?.message?.includes('fetch')) {
        errorMessage += 'Unable to connect to the server. Please check if the backend is running.'
      } else {
        errorMessage += (err?.message || 'Unknown error occurred')
      }
      
      setMessages([...next, {
        role:'assistant',
        content: errorMessage,
        timestamp: Date.now()
      }])
    } finally {
      setLoading(false)
      setIsTyping(false)
    }
  }

  const clearConversation = () => {
    const systemMessage = messages.find(m => m.role === 'system')
    setMessages(systemMessage ? [systemMessage] : [])
  }

  const exportConversation = () => {
    const conversationText = messages
      .filter(m => m.role !== 'system')
      .map(m => `${m.role === 'user' ? 'You' : 'AI Assistant'}: ${m.content}`)
      .join('\n\n')
    
    const blob = new Blob([conversationText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chat-conversation-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleQuickAction = (action: string) => {
    // Directly send the action without setting input first
    onSend(action)
  }

  const hasMessages = messages.filter(m => m.role !== 'system').length > 0
  
  // Filter messages based on search query
  const filteredMessages = searchQuery
    ? messages.filter(m =>
        m.role !== 'system' &&
        m.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : messages.filter(m => m.role !== 'system')

  return (
    <div className="chat-wrapper">
      {/* Modern Chat Header */}
      <div className="chat-header">
        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="chat-title">AI Customer Support</h1>
            <p className="chat-subtitle">How can I help you today?</p>
          </div>
          <div className="flex items-center gap-3">
            {hasMessages && (
              <div className="flex gap-2">
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-medium transition-all"
                  title="Search conversation"
                >
                  Search
                </button>
                <button
                  onClick={exportConversation}
                  className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-medium transition-all"
                  title="Export conversation"
                >
                  Export
                </button>
                <button
                  onClick={clearConversation}
                  className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-medium transition-all"
                  title="Clear conversation"
                >
                  Clear
                </button>
              </div>
            )}
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                connectionStatus === 'connected' ? 'bg-green-400' :
                connectionStatus === 'disconnected' ? 'bg-red-400' :
                'bg-yellow-400'
              }`}></div>
              <span className="text-sm text-white/80">
                {connectionStatus === 'connected' ? 'Connected' :
                 connectionStatus === 'disconnected' ? 'Disconnected' :
                 'Connecting...'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="search-clear"
            >
              ×
            </button>
          )}
        </div>
      )}

      {/* Modern Chat Messages Area */}
      <div className="chat-messages">
        {!hasMessages ? (
          <div className="welcome-section">
            <WelcomeMessage onActionClick={handleQuickAction} />
            <QuickActions onActionClick={handleQuickAction} />
          </div>
        ) : (
          <>
            {searchQuery && filteredMessages.length === 0 && (
              <div className="no-results">
                <p>No messages found for "{searchQuery}"</p>
              </div>
            )}
            {(searchQuery ? filteredMessages : messages.filter(m=>m.role!=='system')).map((m, i)=>(
              <div key={i} className="message-wrapper">
                <ModernMessage
                  role={m.role as any}
                  timestamp={m.timestamp ? new Date(m.timestamp) : new Date()}
                  responseTime={responseTime}
                >
                  {m.content}
                </ModernMessage>
                {/* Enhanced Tool Indicator */}
                {m.role === 'assistant' && <ToolIndicator content={m.content} />}
              </div>
            ))}
            {(loading || isTyping) && (
              <div className="loading-message">
                <div className="loading-indicator">
                  <span>{isTyping ? 'AI is typing...' : 'Thinking...'}</span>
                  <div className="typing-dots">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Floating Quick Actions for existing conversations */}
            <div className="floating-quick-actions">
              <div className="quick-actions-compact">
                <button
                  onClick={() => handleQuickAction('What are your frequently asked questions?')}
                  className="quick-action-btn"
                  title="FAQ"
                >
                  FAQ
                </button>
                <button
                  onClick={() => handleQuickAction('I need to check my order')}
                  className="quick-action-btn"
                  title="Check Order"
                >
                  Order Status
                </button>
                <button
                  onClick={() => handleQuickAction('I want to speak with a human agent')}
                  className="quick-action-btn"
                  title="Human Agent"
                >
                  Human Agent
                </button>
                <button
                  onClick={() => handleQuickAction('Tell me about your company')}
                  className="quick-action-btn"
                  title="Company Info"
                >
                  Company Info
                </button>
              </div>
            </div>
          </>
        )}
        <div ref={bottomRef} />
      </div>
      
      {/* Modern Chat Input Area */}
      <div className="chat-input-area">
        <ModernChatInput 
          onSend={onSend}
          loading={loading}
          input={input}
          setInput={setInput}
        />
      </div>
    </div>
  )
}
