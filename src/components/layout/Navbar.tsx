import React from 'react'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { useNavigate } from 'react-router-dom'
import { Avatar, Dropdown, DropdownItem } from '@/components/ui/Dropdown'
import { Button } from '@/components/ui/Button'
import { Sun, Moon, LogOut, User, Bell } from 'lucide-react'

export function Navbar() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/80 backdrop-blur-xl px-6">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold tracking-tight">
          Welcome back, {user?.name?.split(' ')[0]}
        </h2>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative rounded-lg p-2 text-muted-foreground hover:bg-accent transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-primary" />
        </button>

        <Button variant="ghost" size="sm" onClick={toggleTheme}>
          {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </Button>

        <Dropdown
          trigger={
            <button className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-accent transition-colors">
              <Avatar name={user?.name || 'User'} size="sm" />
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5 capitalize">{user?.role?.replace('_', ' ')}</p>
              </div>
            </button>
          }
        >
          <DropdownItem onClick={() => navigate('/settings')}>
            <User className="h-4 w-4" />
            Profile Settings
          </DropdownItem>
          <DropdownItem onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Sign Out
          </DropdownItem>
        </Dropdown>
      </div>
    </header>
  )
}
