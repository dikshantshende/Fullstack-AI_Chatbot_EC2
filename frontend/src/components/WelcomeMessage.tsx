import { Clock, Star, MessageCircle, Shield, Truck } from 'lucide-react'

interface WelcomeMessageProps {
  onActionClick: (action: string) => void
}

export default function WelcomeMessage({ onActionClick }: WelcomeMessageProps) {
  const features = [
    { icon: Clock, text: '24/7 Support', description: 'Always available to help' },
    { icon: Star, text: 'Instant Answers', description: 'Quick and accurate responses' },
    { icon: MessageCircle, text: 'Live Chat Available', description: 'Connect with human agents' },
    { icon: Shield, text: 'Secure & Private', description: 'Your data is protected' },
    { icon: Truck, text: 'Order Tracking', description: 'Monitor your shipments' }
  ]

  return (
    <div className="welcome-message">
      <div className="welcome-header">
        <div className="welcome-icon">
          <MessageCircle />
        </div>
        <h2 className="welcome-title">
          Welcome to AI Customer Support! 👋
        </h2>
        <p className="welcome-subtitle">
          I'm your AI-powered assistant, ready to help with any questions, technical support, or general assistance. 
          How can I assist you today?
        </p>
      </div>

      {/* Features Grid */}
      <div className="welcome-features">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <div key={index} className="feature-item">
              <div className="feature-icon">
                <Icon className="w-5 h-5" />
              </div>
              <div className="feature-content">
                <h4>{feature.text}</h4>
                <p>{feature.description}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Start Buttons */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        <button
          onClick={() => onActionClick('I need help with something')}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all duration-200 text-sm font-medium transform hover:scale-105 hover:shadow-lg"
        >
          Get Help
        </button>
        <button
          onClick={() => onActionClick('What are your frequently asked questions?')}
          className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl transition-all duration-200 text-sm font-medium transform hover:scale-105 hover:shadow-lg"
        >
          View FAQ
        </button>
        <button
          onClick={() => onActionClick('I want to speak with a human agent')}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl transition-all duration-200 text-sm font-medium transform hover:scale-105 hover:shadow-lg"
        >
          Live Chat
        </button>
      </div>

      {/* Support Info */}
      <div className="welcome-tip">
        <p>
          <strong>Need immediate help?</strong> Call us at <span className="text-blue-600 font-medium">1-800-SUPPORT</span> 
          or email us at <span className="text-blue-600 font-medium">support@company.com</span>
        </p>
      </div>
    </div>
  )
}
