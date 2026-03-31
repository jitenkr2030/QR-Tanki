'use client'

import { useState, useEffect, useCallback } from 'react'
import { saveOfflineData, getOfflineData, markDataAsSynced, getUnsyncedData, localStorageCache, networkStatus, backgroundSync } from '@/lib/offline/storage'

// Hook for online/offline status
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(networkStatus.isOnline())
  const [lastOnline, setLastOnline] = useState<Date | null>(null)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setLastOnline(new Date())
    }

    const handleOffline = () => {
      setIsOnline(false)
    }

    networkStatus.addEventListener(handleOnline)
    networkStatus.addEventListener(handleOffline)

    return () => {
      networkStatus.removeEventListener(handleOnline)
      networkStatus.removeEventListener(handleOffline)
    }
  }, [])

  return { isOnline, lastOnline }
}

// Hook for offline status (wrapper around useNetworkStatus)
export function useOffline() {
  const { isOnline, lastOnline } = useNetworkStatus()
  
  return {
    isOnline,
    isOffline: !isOnline,
    lastOnline
  }
}

// Hook for offline data management
export function useOfflineData<T>(type: string, initialData: T[] = []) {
  const [data, setData] = useState<T[]>(initialData)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { isOnline } = useNetworkStatus()

  // Load data from offline storage
  const loadOfflineData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const offlineData = await getOfflineData<T>(type)
      setData(offlineData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load offline data')
    } finally {
      setIsLoading(false)
    }
  }, [type])

  // Save data to offline storage
  const saveData = useCallback(async (newData: T) => {
    try {
      await saveOfflineData(type, newData)
      setData(prev => [...prev, newData])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save offline data')
    }
  }, [type])

  // Add data to offline storage
  const addData = useCallback(async (newData: T) => {
    try {
      await saveOfflineData(type, newData)
      setData(prev => [...prev, newData])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add offline data')
    }
  }, [type])

  // Remove data from offline storage
  const removeData = useCallback(async (id: number) => {
    try {
      await deleteOfflineData(id)
      setData(prev => prev.filter(item => (item as any).id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove offline data')
    }
  }, [])

  // Sync data with server
  const syncData = useCallback(async () => {
    if (!isOnline) {
      setError('Cannot sync while offline')
      return
    }

    try {
      const unsyncedData = await getUnsyncedData()
      
      for (const item of unsyncedData) {
        if (item.type === type) {
          // Here you would implement the actual sync logic
          // For now, we'll just mark it as synced
          await markDataAsSynced(item.id)
        }
      }
      
      // Reload data after sync
      await loadOfflineData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sync data')
    }
  }, [type, isOnline, loadOfflineData])

  // Load data on mount
  useEffect(() => {
    loadOfflineData()
  }, [loadOfflineData])

  return {
    data,
    isLoading,
    error,
    saveData,
    addData,
    removeData,
    syncData,
    refreshData: loadOfflineData
  }
}

// Hook for offline form submission
export function useOfflineForm<T>(type: string, submitFunction: (data: T) => Promise<any>) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isOffline, setIsOffline] = useState(false)
  const { isOnline } = useNetworkStatus()

  const submitForm = useCallback(async (data: T) => {
    setIsSubmitting(true)
    setSubmitError(null)
    setIsOffline(!isOnline)

    try {
      if (isOnline) {
        // Submit to server
        const result = await submitFunction(data)
        
        // Save to offline storage for backup
        await saveOfflineData(type, data)
        
        return result
      } else {
        // Save to offline storage for later sync
        await saveOfflineData(type, data)
        
        // Register background sync
        await backgroundSync.register(`background-sync-${type}`)
        
        return { offline: true, message: 'Data saved for later sync' }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Submission failed'
      setSubmitError(errorMessage)
      
      // Save to offline storage even if submission failed
      await saveOfflineData(type, data)
      
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }, [type, submitFunction, isOnline])

  return {
    isSubmitting,
    submitError,
    isOffline,
    submitForm
  }
}

// Hook for cached data
export function useCachedData<T>(key: string, fetchFunction: () => Promise<T>, staleTime: number = 5 * 60 * 1000) {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const { isOnline } = useNetworkStatus()

  // Load data from cache or network
  const loadData = useCallback(async (forceRefresh = false) => {
    setIsLoading(true)
    setError(null)

    try {
      // Try to get from cache first
      const cachedData = localStorageCache.get(key)
      const now = new Date()
      
      if (cachedData && !forceRefresh) {
        const cachedAt = new Date(cachedData.cachedAt)
        const isStale = now.getTime() - cachedAt.getTime() > staleTime
        
        if (!isStale) {
          setData(cachedData.data)
          setLastUpdated(cachedAt)
          setIsLoading(false)
          return
        }
      }

      // Fetch fresh data if online
      if (isOnline) {
        const freshData = await fetchFunction()
        const cacheData = {
          data: freshData,
          cachedAt: now.toISOString()
        }
        
        localStorageCache.set(key, cacheData)
        setData(freshData)
        setLastUpdated(now)
      } else if (cachedData) {
        // Use cached data if offline
        setData(cachedData.data)
        setLastUpdated(new Date(cachedData.cachedAt))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setIsLoading(false)
    }
  }, [key, fetchFunction, staleTime, isOnline])

  // Load data on mount
  useEffect(() => {
    loadData()
  }, [loadData])

  // Refresh data
  const refresh = useCallback(() => {
    return loadData(true)
  }, [loadData])

  return {
    data,
    isLoading,
    error,
    refresh,
    isStale: lastUpdated ? new Date().getTime() - lastUpdated.getTime() > staleTime : false
  }
}

// Hook for offline action queue
export function useOfflineActionQueue() {
  const [queue, setQueue] = useState<any[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const { isOnline } = useNetworkStatus()

  // Add action to queue
  const addAction = useCallback((action: any) => {
    setQueue(prev => [...prev, { ...action, id: Date.now(), timestamp: new Date().toISOString() }])
  }, [])

  // Process queue
  const processQueue = useCallback(async () => {
    if (!isOnline || isProcessing || queue.length === 0) {
      return
    }

    setIsProcessing(true)

    try {
      const actionsToProcess = [...queue]
      setQueue([])

      for (const action of actionsToProcess) {
        try {
          // Process the action
          if (action.type === 'API_CALL') {
            await fetch(action.url, action.options)
          } else if (action.type === 'FUNCTION_CALL') {
            await action.function(...action.args)
          }
        } catch (error) {
          console.error('Error processing queued action:', error)
          // Re-add failed action to queue
          addAction(action)
        }
      }
    } catch (error) {
      console.error('Error processing queue:', error)
    } finally {
      setIsProcessing(false)
    }
  }, [isOnline, isProcessing, queue, addAction])

  // Auto-process queue when online
  useEffect(() => {
    if (isOnline && queue.length > 0 && !isProcessing) {
      processQueue()
    }
  }, [isOnline, queue.length, isProcessing, processQueue])

  return {
    queue,
    isProcessing,
    addAction,
    processQueue,
    clearQueue: () => setQueue([])
  }
}

// Hook for offline notifications
export function useOfflineNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    // Check if notifications are supported
    if ('Notification' in window) {
      // Use setTimeout to avoid synchronous setState
      const timer = setTimeout(() => {
        setIsSupported(true)
        setPermission(Notification.permission)
      }, 0)

      return () => clearTimeout(timer)
    }
  }, [])

  // Request notification permission
  const requestPermission = useCallback(async () => {
    if (!isSupported) {
      return false
    }

    const result = await Notification.requestPermission()
    setPermission(result)
    return result === 'granted'
  }, [isSupported])

  // Show notification
  const showNotification = useCallback((title: string, options: NotificationOptions = {}) => {
    if (!isSupported || permission !== 'granted') {
      return false
    }

    const notification = new Notification(title, {
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-192x192.png',
      ...options
    })

    // Auto-close after 5 seconds
    setTimeout(() => {
      notification.close()
    }, 5000)

    return true
  }, [isSupported, permission])

  return {
    isSupported,
    permission,
    requestPermission,
    showNotification
  }
}