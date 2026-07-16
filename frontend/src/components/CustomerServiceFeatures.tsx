import { useState } from 'react'
import { Star, MessageCircle, Clock, CheckCircle, XCircle } from 'lucide-react'

interface CustomerServiceFeaturesProps {
  onRateResponse: (rating: number) => void
  onRequestLiveChat: () => void
}

export default function CustomerServiceFeatures({ onRateResponse, onRequestLiveChat }: CustomerServiceFeaturesProps) {
  const [showRating, setShowRating] = useState(false)
  const [rating, setRating] = useState(0)
  const [showLiveChatPrompt, setShowLiveChatPrompt] = useState(false)

  const handleRating = (value: number) => {
    setRating(value)
    onRateResponse(value)
    setShowRating(false)
  }

  const handleLiveChatRequest = () => {
    onRequestLiveChat()
    setShowLiveChatPrompt(false)
  }

  return (
    <div className="space-y-4">
      {/* Live Chat Indicator */}
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-green-700 dark:text-green-400 font-medium">
            Live agents available now
          </span>
          <button
            onClick={() => setShowLiveChatPrompt(true)}
            className="ml-auto text-xs bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded transition-colors"
          >
            Connect
          </button>
        </div>
      </div>

      {/* Response Time Indicator */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-sm text-blue-700 dark:text-blue-400">
            Average response time: <strong>30 seconds</strong>
          </span>
        </div>
      </div>

      {/* Rating Prompt */}
      {showRating && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="text-center">
            <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-3">
              Was this response helpful?
            </p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() => handleRating(value)}
                  className={`p-2 rounded-full transition-colors ${
                    rating >= value 
                      ? 'text-yellow-500 hover:text-yellow-600' 
                      : 'text-gray-400 hover:text-yellow-500'
                  }`}
                >
                  <Star className="w-5 h-5 fill-current" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Live Chat Prompt */}
      {showLiveChatPrompt && (
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
          <div className="text-center">
            <MessageCircle className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
            <p className="text-sm text-purple-800 dark:text-purple-200 mb-3">
              Would you like to connect with a live agent?
            </p>
            <div className="flex justify-center gap-2">
              <button
                onClick={handleLiveChatRequest}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm"
              >
                Yes, connect me
              </button>
              <button
                onClick={() => setShowLiveChatPrompt(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition-colors text-sm"
              >
                No, thanks
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setShowRating(true)}
          className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm"
        >
          <Star className="w-4 h-4 text-yellow-500" />
          Rate Response
        </button>
        <button
          onClick={() => setShowLiveChatPrompt(true)}
          className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm"
        >
          <MessageCircle className="w-4 h-4 text-green-500" />
          Live Chat
        </button>
      </div>
    </div>
  )
}




