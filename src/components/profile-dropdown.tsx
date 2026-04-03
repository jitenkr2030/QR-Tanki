// Profile Dropdown Component
// Interactive profile dropdown menu for QR Tanki

'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  Settings, 
  LogOut, 
  CreditCard, 
  HelpCircle, 
  Shield,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface ProfileDropdownProps {
  userName: string
  userEmail?: string
  userRole?: string
}

export function ProfileDropdown({ userName, userEmail, userRole }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  const handleProfile = () => {
    router.push('/profile')
    setIsOpen(false)
  }

  const handleSettings = () => {
    router.push('/settings')
    setIsOpen(false)
  }

  const handleBilling = () => {
    router.push('/billing')
    setIsOpen(false)
  }

  const handleHelp = () => {
    router.push('/help')
    setIsOpen(false)
  }

  const getRoleColor = (role?: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-purple-100 text-purple-800'
      case 'CLEANER': return 'bg-green-100 text-green-800'
      case 'USER': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center space-x-2 h-8 px-2 rounded-full hover:bg-gray-100 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-xs font-medium text-blue-600">
            {userName.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="text-sm font-medium hidden sm:block">{userName}</span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-blue-600">
                  {userName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{userName}</p>
                {userEmail && (
                  <p className="text-xs text-gray-500">{userEmail}</p>
                )}
                {userRole && (
                  <Badge variant="secondary" className="mt-1 text-xs">
                    {userRole}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <button
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-3 transition-colors"
              onClick={handleProfile}
            >
              <User className="w-4 h-4 text-gray-400" />
              <span>My Profile</span>
            </button>

            <button
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-3 transition-colors"
              onClick={handleSettings}
            >
              <Settings className="w-4 h-4 text-gray-400" />
              <span>Settings</span>
            </button>

            <button
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-3 transition-colors"
              onClick={handleBilling}
            >
              <CreditCard className="w-4 h-4 text-gray-400" />
              <span>Billing & Plans</span>
            </button>

            <button
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-3 transition-colors"
              onClick={handleHelp}
            >
              <HelpCircle className="w-4 h-4 text-gray-400" />
              <span>Help & Support</span>
            </button>

            {userRole === 'ADMIN' && (
              <button
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-3 transition-colors"
                onClick={() => router.push('/admin')}
              >
                <Shield className="w-4 h-4 text-gray-400" />
                <span>Admin Panel</span>
              </button>
            )}
          </div>

          {/* Sign Out */}
          <div className="border-t border-gray-100 pt-2">
            <button
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3 transition-colors"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}