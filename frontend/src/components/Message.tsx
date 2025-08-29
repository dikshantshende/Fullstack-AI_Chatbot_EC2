import { ReactNode, useState } from 'react'
import { Copy, Check } from 'lucide-react'

export default function Message({ role, children, timestamp }:{
  role:'user'|'assistant'|'system', 
  children:ReactNode,
  timestamp?: Date
}) {
  const isUser = role==='user'
  const isSystem = role==='system'
  const [copied, setCopied] = useState(false)
  
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
  
  return (
    <div className={`flex ${isUser?'justify-end':'justify-start'} my-2 group`}>
      <div className={`max-w-[85%] rounded-2xl px-4 py-2 shadow transition-colors relative ${
        isUser 
          ? 'bg-blue-600 text-white hover:bg-blue-700' 
          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
      }`}>
        {/* Copy Button */}
        {!isUser && (
          <button
            onClick={copyToClipboard}
            className={`absolute top-2 right-2 p-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-200 ${
              copied 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
            title="Copy message"
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          </button>
        )}
        
        <div className="flex items-center justify-between mb-1">
          {!isUser && <span className="text-xs text-gray-500 dark:text-gray-400">{role}</span>}
          {timestamp && (
            <span className="text-xs text-gray-400 dark:text-gray-500 ml-auto">
              {formatTime(timestamp)}
            </span>
          )}
        </div>
        <div className="whitespace-pre-wrap">{children}</div>
      </div>
    </div>
  )
}
