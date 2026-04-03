// Offline Status Indicator Component
// Simple offline status indicator for QR Tanki

'use client'

import { useOffline } from '@/lib/offline/hooks'
import { Wifi, WifiOff } from 'lucide-react'

export function OfflineStatusIndicator() {
  const { isOnline, isOffline } = useOffline()

  if (isOnline) {
    return (
      <div className="flex items-center space-x-2 text-green-600">
        <Wifi className="h-4 w-4" />
        <span className="text-sm">Online</span>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-2 text-red-600">
      <WifiOff className="h-4 w-4" />
      <span className="text-sm">Offline</span>
    </div>
  )
}