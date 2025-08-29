import { useState, useRef, useEffect } from 'react'
import { Send, Mic, MicOff, Paperclip, Smile, X, Upload, Image, FileText } from 'lucide-react'

interface ModernChatInputProps {
  onSend: (message: string) => void
  loading: boolean
  input: string
  setInput: (input: string) => void
}

export default function ModernChatInput({ onSend, loading, input, setInput }: ModernChatInputProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showFileUpload, setShowFileUpload] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Enter to send message
      if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault()
        if (input.trim() && !loading) {
          onSend(input.trim())
        }
      }
      // Escape to clear input
      if (e.key === 'Escape') {
        setInput('')
        setShowEmojiPicker(false)
        setShowFileUpload(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [input, loading, onSend])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return
    onSend(input.trim())
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        chunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' })
        // Here you could send the audio to a speech-to-text service
        // For now, we'll just show a placeholder
        setInput('Voice message recorded (speech-to-text not implemented)')
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error accessing microphone:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
      setIsRecording(false)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Here you could upload the file to your backend
      // For now, we'll just show a placeholder
      setInput(`File uploaded: ${file.name} (file processing not implemented)`)
    }
    setShowFileUpload(false)
  }

  const emojis = ['😊', '👍', '❤️', '🎉', '🔥', '💡', '🚀', '⭐', '🎯', '💪', '😄', '🤔', '👏', '🙏', '✨']

  return (
    <div className="modern-chat-input relative">
      {/* Enhanced File Upload Modal */}
      {showFileUpload && (
        <div className="absolute bottom-full left-0 mb-3 p-4 bg-white rounded-2xl shadow-2xl border border-gray-200/50 backdrop-blur-sm min-w-[280px] z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Upload className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Upload File</h4>
              <p className="text-sm text-gray-500">Share documents or images</p>
            </div>
            <button
              onClick={() => setShowFileUpload(false)}
              className="ml-auto p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 transition-colors group"
            >
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-gray-900">Choose a file</p>
                  <p className="text-sm text-gray-500">or drag and drop</p>
                </div>
              </div>
            </button>
            
            <div className="flex gap-2">
              <button className="flex-1 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-2">
                  <Image className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Image</span>
                </div>
              </button>
              <button className="flex-1 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Document</span>
                </div>
              </button>
            </div>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            accept=".txt,.pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
        </div>
      )}

      {/* Enhanced Emoji Picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-full left-0 mb-3 p-4 bg-white rounded-2xl shadow-2xl border border-gray-200/50 backdrop-blur-sm min-w-[320px] z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Smile className="w-4 h-4 text-yellow-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Quick Emojis</h4>
              <p className="text-sm text-gray-500">Express yourself</p>
            </div>
            <button
              onClick={() => setShowEmojiPicker(false)}
              className="ml-auto p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {emojis.map((emoji, index) => (
              <button
                key={index}
                onClick={() => {
                  setInput(input + emoji)
                  setShowEmojiPicker(false)
                }}
                className="p-3 hover:bg-gray-100 rounded-xl text-xl transition-all duration-200 hover:scale-110"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="input-form relative">
        <div className="input-container relative">
          {/* Enhanced Action Buttons */}
          <div className="input-actions">
            <button
              type="button"
              onClick={() => setShowFileUpload(!showFileUpload)}
              className="action-btn"
              title="Attach file"
            >
              <Paperclip />
            </button>
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="action-btn"
              title="Add emoji"
            >
              <Smile />
            </button>
          </div>

          {/* Enhanced Input Field */}
          <div className="input-wrapper flex-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message here..."
              rows={1}
              className="message-textarea w-full min-h-[40px] resize-none"
              style={{ zIndex: 1 }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e as any)
                }
              }}
            />
          </div>

          {/* Enhanced Voice Button */}
          <button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            className={`action-btn ${
              isRecording ? 'text-red-500' : ''
            }`}
            title={isRecording ? 'Stop recording' : 'Voice message'}
          >
            {isRecording ? <MicOff /> : <Mic />}
          </button>
        </div>

        {/* Enhanced Send Button */}
        <div className="send-actions">
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="send-btn"
            title="Send message"
          >
            <Send />
          </button>
        </div>

        {/* Input Footer */}
        <div className="input-footer">
          <div className="typing-indicator">
            Type your message... (Ctrl+Enter to send, Esc to clear)
          </div>
        </div>
      </form>

      {/* Enhanced Recording Indicator */}
      {isRecording && (
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 px-6 py-3 bg-red-500 text-white rounded-xl shadow-2xl animate-pulse z-10">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
            <span className="text-sm font-semibold">Recording...</span>
            <div className="w-3 h-3 bg-white rounded-full animate-ping" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      )}
    </div>
  )
}

