import { ReactNode, useState } from 'react'
import { Copy, Check, ThumbsUp, ThumbsDown, MoreVertical, Bot, User } from 'lucide-react'

interface ModernMessageProps {
  role: 'user' | 'assistant' | 'system'
  children: ReactNode
  timestamp?: Date
  responseTime?: number
}

export default function ModernMessage({ role, children, timestamp, responseTime }: ModernMessageProps) {
  const [copied, setCopied] = useState(false)
  const [showActions, setShowActions] = useState(false)
  const [rating, setRating] = useState<'up' | 'down' | null>(null)
  
  const isUser = role === 'user'
  const isSystem = role === 'system'
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(children as string)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleRating = (type: 'up' | 'down') => {
    setRating(type)
    // Here you could send the rating to your backend
    console.log(`Message rated: ${type}`)
  }
  
  return (
    <div className={`modern-message ${isUser ? 'user-message' : 'assistant-message'}`}>
      {/* Avatar */}
      <div className="message-avatar">
        <div className={`avatar ${isUser ? 'user-avatar' : 'assistant-avatar'}`}>
          {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
        </div>
      </div>

      {/* Message Content */}
      <div className="message-content">
        {/* Message Header */}
        <div className="message-header">
          <div className="message-role">
            {isUser ? 'You' : 'AI Assistant'}
          </div>
          <div className="message-meta">
            {timestamp && (
              <div className="message-time">
                <span>🕒</span>
                {formatTime(timestamp)}
              </div>
            )}
            {responseTime && (
              <div className="response-time">
                <span>⚡</span>
                {responseTime}ms
              </div>
            )}
          </div>
        </div>

        {/* Message Text */}
        <div className="message-text">
          {children}
        </div>

        {/* Action Buttons */}
        {!isUser && (
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={copyToClipboard}
              className={`p-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 ${
                copied
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
              title="Copy message"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={() => handleRating('up')}
              className={`p-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 ${
                rating === 'up'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
              title="Helpful"
            >
              <ThumbsUp className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleRating('down')}
              className={`p-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 ${
                rating === 'down'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
              title="Not helpful"
            >
              <ThumbsDown className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
              title="More actions"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Additional Actions Dropdown */}
        {showActions && !isUser && (
          <div className="absolute top-full right-0 mt-2 p-2 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <button className="block w-full text-left px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded">
              Save to favorites
            </button>
            <button className="block w-full text-left px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded">
              Share message
            </button>
            <button className="block w-full text-left px-3 py-1 text-sm text-red-600 hover:bg-gray-100 rounded">
              Report issue
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
