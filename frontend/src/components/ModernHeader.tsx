import { Sparkles, Bot, Settings, Menu } from 'lucide-react'

interface ModernHeaderProps {
  onToggleSidebar: () => void
  sidebarOpen: boolean
}

export default function ModernHeader({ onToggleSidebar, sidebarOpen }: ModernHeaderProps) {
  return (
    <div className="modern-header">
      <div className="header-left">
        <button
          onClick={onToggleSidebar}
          className="menu-btn"
          title="Toggle sidebar"
        >
          <Menu />
        </button>
        
        <div className="header-title">
          TORQ ChatBot
          <div className="developer-credit">
            Developed by Dikshant Shende
          </div>
        </div>
      </div>
      
      <div className="header-right">
        <button className="settings-btn" title="Settings">
          <Settings />
        </button>
      </div>
    </div>
  )
}
