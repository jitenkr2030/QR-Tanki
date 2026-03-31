'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useNetworkStatus, useOfflineNotifications } from '@/lib/offline/hooks'
import { serviceWorkerManager } from '@/lib/offline/service-worker'

interface OfflineContextType {
  isOnline: boolean
  isOffline: boolean
  lastOnline: Date | null
  isServiceWorkerActive: boolean
  showOfflineNotification: boolean
  setShowOfflineNotification: (show: boolean) => void
  syncData: () => Promise<void>
  clearCache: () => Promise<void>
  requestNotificationPermission: () => Promise<boolean>
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined)

export function useOffline() {
  const context = useContext(OfflineContext)
  if (context === undefined) {
    throw new Error('useOffline must be used within an OfflineProvider')
  }
  return context
}

interface OfflineProviderProps {
  children: ReactNode
}

export function OfflineProvider({ children }: OfflineProviderProps) {
  const { isOnline, lastOnline } = useNetworkStatus()
  const [showOfflineNotification, setShowOfflineNotification] = useState(false)
  const [isServiceWorkerActive, setIsServiceWorkerActive] = useState(false)
  const { requestNotificationPermission, showNotification } = useOfflineNotifications()

  // Check service worker status
  useEffect(() => {
    const checkServiceWorker = () => {
      setIsServiceWorkerActive(serviceWorkerManager.isActive())
    }

    // Check immediately
    checkServiceWorker()

    // Check when service worker becomes active
    const handleControllerChange = () => {
      checkServiceWorker()
    }

    serviceWorkerManager.on('controllerchange', handleControllerChange)

    return () => {
      serviceWorkerManager.off('controllerchange', handleControllerChange)
    }
  }, [])

  // Show offline notification when going offline
  useEffect(() => {
    if (!isOnline && !showOfflineNotification) {
      // Use setTimeout to avoid synchronous setState
      const timer = setTimeout(() => {
        setShowOfflineNotification(true)
        showNotification('You are offline', {
          body: 'Some features may not be available. Your data will be saved locally.',
          icon: '/icons/icon-192x192.png',
          tag: 'offline-notification'
        })
      }, 0)

      return () => clearTimeout(timer)
    } else if (isOnline && showOfflineNotification) {
      // Use setTimeout to avoid synchronous setState
      const timer = setTimeout(() => {
        setShowOfflineNotification(false)
        showNotification('You are back online', {
          body: 'All features are now available. Syncing your offline data...',
          icon: '/icons/icon-192x192.png',
          tag: 'online-notification'
        })
      }, 0)

      return () => clearTimeout(timer)
    }
  }, [isOnline, showOfflineNotification, showNotification])

  // Sync data when coming back online
  const syncData = async () => {
    if (!isOnline) {
      return
    }

    try {
      // Trigger background sync for all types
      await serviceWorkerManager.triggerSync('background-sync-bookings')
      await serviceWorkerManager.triggerSync('background-sync-payments')
      await serviceWorkerManager.triggerSync('background-sync-feedback')
      
      showNotification('Data synced successfully', {
        body: 'Your offline data has been synchronized with the server.',
        icon: '/icons/icon-192x192.png',
        tag: 'sync-notification'
      })
    } catch (error) {
      console.error('Error syncing data:', error)
      showNotification('Sync failed', {
        body: 'Failed to sync your offline data. Please try again.',
        icon: '/icons/icon-192x192.png',
        tag: 'sync-error-notification'
      })
    }
  }

  // Clear cache
  const clearCache = async () => {
    try {
      const success = await serviceWorkerManager.clearCache()
      if (success) {
        showNotification('Cache cleared', {
          body: 'Application cache has been cleared successfully.',
          icon: '/icons/icon-192x192.png',
          tag: 'cache-cleared-notification'
        })
      }
    } catch (error) {
      console.error('Error clearing cache:', error)
      showNotification('Cache clear failed', {
        body: 'Failed to clear application cache.',
        icon: '/icons/icon-192x192.png',
        tag: 'cache-error-notification'
      })
    }
  }

  // Request notification permission
  const handleRequestNotificationPermission = async () => {
    return await requestNotificationPermission()
  }

  const contextValue: OfflineContextType = {
    isOnline,
    isOffline: !isOnline,
    lastOnline,
    isServiceWorkerActive,
    showOfflineNotification,
    setShowOfflineNotification,
    syncData,
    clearCache,
    requestNotificationPermission: handleRequestNotificationPermission
  }

  return (
    <OfflineContext.Provider value={contextValue}>
      {children}
    </OfflineContext.Provider>
  )
}