// Offline Storage Utilities for QR Tanki
// Using IndexedDB for offline data storage

const DB_NAME = 'qrtanki-offline'
const DB_VERSION = 1
const STORE_NAME = 'offline-data'

// Open IndexedDB
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    
    request.onerror = () => {
      console.error('IndexedDB error:', request.error)
      reject(request.error)
    }
    
    request.onsuccess = () => {
      resolve(request.result)
    }
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result
      
      // Create object store if it doesn't exist
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true })
        store.createIndex('type', 'type', { unique: false })
        store.createIndex('timestamp', 'timestamp', { unique: false })
      }
    }
  })
}

// Save data to IndexedDB
export async function saveOfflineData(type, data) {
  try {
    const db = await openDB()
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    
    const offlineData = {
      type,
      data,
      timestamp: new Date().toISOString(),
      synced: false
    }
    
    const request = store.add(offlineData)
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  } catch (error) {
    console.error('Error saving offline data:', error)
    throw error
  }
}

// Get offline data by type
export async function getOfflineData(type) {
  try {
    const db = await openDB()
    const transaction = db.transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    const index = store.index('type')
    
    const request = index.getAll(type)
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  } catch (error) {
    console.error('Error getting offline data:', error)
    throw error
  }
}

// Get all offline data
export async function getAllOfflineData() {
  try {
    const db = await openDB()
    const transaction = db.transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    
    const request = store.getAll()
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  } catch (error) {
    console.error('Error getting all offline data:', error)
    throw error
  }
}

// Mark data as synced
export async function markDataAsSynced(id) {
  try {
    const db = await openDB()
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    
    const request = store.get(id)
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const data = request.result
        if (data) {
          data.synced = true
          data.syncedAt = new Date().toISOString()
          const updateRequest = store.put(data)
          
          updateRequest.onsuccess = () => resolve(updateRequest.result)
          updateRequest.onerror = () => reject(updateRequest.error)
        } else {
          reject(new Error('Data not found'))
        }
      }
      request.onerror = () => reject(request.error)
    })
  } catch (error) {
    console.error('Error marking data as synced:', error)
    throw error
  }
}

// Delete offline data
export async function deleteOfflineData(id) {
  try {
    const db = await openDB()
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    
    const request = store.delete(id)
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  } catch (error) {
    console.error('Error deleting offline data:', error)
    throw error
  }
}

// Clear all offline data
export async function clearOfflineData() {
  try {
    const db = await openDB()
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    
    const request = store.clear()
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  } catch (error) {
    console.error('Error clearing offline data:', error)
    throw error
  }
}

// Get unsynced data
export async function getUnsyncedData() {
  try {
    const db = await openDB()
    const transaction = db.transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    
    const request = store.getAll()
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const allData = request.result
        const unsyncedData = allData.filter(item => !item.synced)
        resolve(unsyncedData)
      }
      request.onerror = () => reject(request.error)
    })
  } catch (error) {
    console.error('Error getting unsynced data:', error)
    throw error
  }
}

// LocalStorage fallback for simple data
export const localStorageCache = {
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('LocalStorage set error:', error)
    }
  },
  
  get(key) {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error('LocalStorage get error:', error)
      return null
    }
  },
  
  remove(key) {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('LocalStorage remove error:', error)
    }
  },
  
  clear() {
    try {
      localStorage.clear()
    } catch (error) {
      console.error('LocalStorage clear error:', error)
    }
  }
}

// Cache management utilities
export const cacheManager = {
  // Cache API wrapper
  async cacheRequest(url, options = {}) {
    try {
      const cache = await caches.open('qrtanki-dynamic-v1')
      const request = new Request(url, options)
      const response = await cache.match(request)
      
      if (response) {
        return response
      } else {
        const networkResponse = await fetch(request)
        if (networkResponse.ok) {
          cache.put(request, networkResponse.clone())
        }
        return networkResponse
      }
    } catch (error) {
      console.error('Cache request error:', error)
      throw error
    }
  },
  
  // Get cached response
  async getCachedResponse(url) {
    try {
      const cache = await caches.open('qrtanki-dynamic-v1')
      return await cache.match(url)
    } catch (error) {
      console.error('Get cached response error:', error)
      return null
    }
  },
  
  // Clear cache
  async clearCache() {
    try {
      await caches.delete('qrtanki-dynamic-v1')
    } catch (error) {
      console.error('Clear cache error:', error)
    }
  }
}

// Network status utilities
export const networkStatus = {
  isOnline() {
    return navigator.onLine
  },
  
  addEventListener(callback) {
    window.addEventListener('online', callback)
    window.addEventListener('offline', callback)
  },
  
  removeEventListener(callback) {
    window.removeEventListener('online', callback)
    window.removeEventListener('offline', callback)
  }
}

// Background sync utilities
export const backgroundSync = {
  // Register background sync
  async register(tag) {
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      const registration = await navigator.serviceWorker.ready
      return registration.sync.register(tag)
    }
    return Promise.resolve()
  },
  
  // Get registration
  async getRegistration() {
    if ('serviceWorker' in navigator) {
      return await navigator.serviceWorker.ready
    }
    return null
  }
}

console.log('Offline storage utilities loaded')