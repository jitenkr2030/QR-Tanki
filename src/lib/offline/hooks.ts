// Offline hooks for QR Tanki Platform
// Provides offline functionality and data caching

'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'

// Simple offline hook implementation
export function useOffline() {
  const [isOnline, setIsOnline] = useState(true)
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    // Set initial online status from navigator state
    const updateOnlineStatus = () => {
      const online = navigator.onLine;
      setIsOnline(online);
      setIsOffline(!online);
    };

    updateOnlineStatus();

    // Listen for online/offline events
    const handleOnline = () => {
      setIsOnline(true);
      setIsOffline(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setIsOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const syncData = useCallback(async () => {
    // Mock sync functionality
    console.log('Syncing data...')
    return Promise.resolve()
  }, [])

  return {
    isOnline,
    isOffline,
    syncData
  }
}

// Simple cached data hook
export function useCachedData<T>(key: string, fetcher: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const refresh = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await fetcher()
      setData(result)
    } catch (err) {
      setError(err as Error)
    } finally {
      setIsLoading(false)
    }
  }, [fetcher])

  useEffect(() => {
    refresh()
  }, [refresh])

  return {
    data,
    isLoading,
    error,
    refresh
  }
}

// Simple local storage cache
export const localStorageCache = {
  get: (key: string) => {
    if (typeof window === 'undefined') return null
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch {
      return null
    }
  },
  
  set: (key: string, value: any) => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Ignore errors
    }
  },
  
  remove: (key: string) => {
    if (typeof window === 'undefined') return
    try {
      localStorage.removeItem(key)
    } catch {
      // Ignore errors
    }
  }
}