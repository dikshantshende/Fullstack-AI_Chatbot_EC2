import { HelpCircle, FileText, Phone, MessageCircle, Settings, Info, Shield } from 'lucide-react'

interface QuickActionsProps {
  onActionClick: (action: string) => void
}

export default function QuickActions({ onActionClick }: QuickActionsProps) {
  const quickActions = [
    { 
      icon: HelpCircle, 
      label: 'Get Help', 
      description: 'General assistance',
      action: 'I need help with something'
    },
    { 
      icon: FileText, 
      label: 'FAQ', 
      description: 'Common questions',
      action: 'What are your frequently asked questions?'
    },
    { 
      icon: Phone, 
      label: 'Contact Us', 
      description: 'Speak with agent',
      action: 'I want to speak with a human agent'
    },
    { 
      icon: MessageCircle, 
      label: 'Live Chat', 
      description: 'Real-time support',
      action: 'Can I chat with a live agent?'
    },
    { 
      icon: Settings, 
      label: 'Technical Support', 
      description: 'Technical issues',
      action: 'I have a technical problem'
    },
    { 
      icon: Info, 
      label: 'About Us', 
      description: 'Company information',
      action: 'Tell me about your company'
    },
    { 
      icon: Shield, 
      label: 'Privacy Policy', 
      description: 'Data protection',
      action: 'What is your privacy policy?'
    },
    { 
      icon: FileText, 
      label: 'Terms of Service', 
      description: 'Terms & conditions',
      action: 'What are your terms of service?'
    }
  ]

  return (
    <div className="quick-actions">
      <h3 className="quick-actions-title">
        How can I help you today?
      </h3>
      
      <div className="actions-grid">
        {quickActions.map((action, index) => {
          const Icon = action.icon
          return (
            <button
              key={index}
              onClick={() => onActionClick(action.action)}
              className="action-button"
              title={action.description}
            >
              <div className="action-icon">
                <Icon />
              </div>
              <div className="action-text">
                <div className="text-sm">{action.label}</div>
                <div className="text-xs opacity-90 mt-1 hidden sm:block">{action.description}</div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
