import { Sparkles, Bot, Settings, Menu, LogOut } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface ModernHeaderProps {
  onToggleSidebar: () => void
  sidebarOpen: boolean
}

export default function ModernHeader({ onToggleSidebar, sidebarOpen }: ModernHeaderProps) {
  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

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
        <button className="settings-btn" title="Sign Out" onClick={handleSignOut}>
          <LogOut />
        </button>
      </div>
    </div>
  )
}
