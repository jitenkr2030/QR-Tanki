// Mobile Navigation Component
// Simple mobile navigation for QR Tanki

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'

interface MobileNavProps {
  userId: string
}

export function MobileNav({ userId }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border shadow-lg z-50">
          <div className="p-4 space-y-2">
            <a href="/dashboard" className="block py-2 text-sm">Dashboard</a>
            <a href="/tanks" className="block py-2 text-sm">My Tanks</a>
            <a href="/bookings" className="block py-2 text-sm">Bookings</a>
            <a href="/subscriptions" className="block py-2 text-sm">Subscriptions</a>
          </div>
        </div>
      )}
    </div>
  )
}