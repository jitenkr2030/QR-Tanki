// Service Worker Manager for QR Tanki
// Handles service worker registration, communication, and offline functionality

export class ServiceWorkerManager {
  private registration: ServiceWorkerRegistration | null = null
  private isSupported: boolean = false
  private isRegistered: boolean = false
  private eventListeners: Map<string, ((data?: any) => void)[]> = new Map()

  constructor() {
    this.isSupported = 'serviceWorker' in navigator
  }

  // Register service worker
  async register(): Promise<boolean> {
    if (!this.isSupported) {
      console.warn('Service Worker is not supported')
      return false
    }

    try {
      // Register service worker
      this.registration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/'
      })

      this.isRegistered = true
      console.log('Service Worker registered successfully')

      // Set up event listeners
      this.setupEventListeners()

      // Wait for service worker to be activated
      await this.waitForActivation()

      return true
    } catch (error) {
      console.error('Service Worker registration failed:', error)
      return false
    }
  }

  // Wait for service worker activation
  private async waitForActivation(): Promise<void> {
    if (!this.registration) {
      return
    }

    return new Promise((resolve) => {
      const checkState = () => {
        if (this.registration!.active) {
          resolve()
        } else {
          this.registration!.addEventListener('controllerchange', () => {
            if (this.registration!.active) {
              resolve()
            }
          })
        }
      }

      checkState()
    })
  }

  // Set up event listeners
  private setupEventListeners(): void {
    if (!this.registration) {
      return
    }

    // Listen for messages from service worker
    navigator.serviceWorker.addEventListener('message', (event) => {
      this.handleServiceWorkerMessage(event)
    })

    // Listen for controller change
    navigator.serviceWorker.addEventListener('controllerchange', (event) => {
      console.log('Service Worker controller changed')
      this.emit('controllerchange', { controller: event.target })
    })
  }

  // Handle messages from service worker
  private handleServiceWorkerMessage(event: MessageEvent): void {
    const { type, data } = event.data

    switch (type) {
      case 'CACHE_UPDATED':
        this.emit('cacheUpdated', data)
        break
      case 'OFFLINE_MODE':
        this.emit('offlineMode', data)
        break
      case 'ONLINE_MODE':
        this.emit('onlineMode', data)
        break
      case 'SYNC_COMPLETED':
        this.emit('syncCompleted', data)
        break
      case 'PUSH_NOTIFICATION':
        this.emit('pushNotification', data)
        break
      default:
        console.log('Unknown message type from service worker:', type)
    }
  }

  // Get service worker version
  async getVersion(): Promise<string | null> {
    if (!this.registration || !this.registration.active) {
      return null
    }

    try {
      // Send message to service worker to get version
      this.registration.active.postMessage({ type: 'GET_VERSION' })

      // Wait for response
      return new Promise((resolve) => {
        const handleMessage = (event: MessageEvent) => {
          if (event.data.type === 'VERSION_RESPONSE') {
            navigator.serviceWorker.removeEventListener('message', handleMessage)
            resolve(event.data.version)
          }
        }

        navigator.serviceWorker.addEventListener('message', handleMessage)

        // Timeout after 5 seconds
        setTimeout(() => {
          navigator.serviceWorker.removeEventListener('message', handleMessage)
          resolve(null)
        }, 5000)
      })
    } catch (error) {
      console.error('Error getting service worker version:', error)
      return null
    }
  }

  // Clear service worker cache
  async clearCache(): Promise<boolean> {
    if (!this.registration || !this.registration.active) {
      return false
    }

    try {
      // Send message to service worker to clear cache
      this.registration.active.postMessage({ type: 'CLEAR_CACHE' })

      // Wait for response
      return new Promise((resolve) => {
        const handleMessage = (event: MessageEvent) => {
          if (event.data.type === 'CACHE_CLEARED') {
            navigator.serviceWorker.removeEventListener('message', handleMessage)
            resolve(event.data.success)
          }
        }

        navigator.serviceWorker.addEventListener('message', handleMessage)

        // Timeout after 10 seconds
        setTimeout(() => {
          navigator.serviceWorker.removeEventListener('message', handleMessage)
          resolve(false)
        }, 10000)
      })
    } catch (error) {
      console.error('Error clearing service worker cache:', error)
      return false
    }
  }

  // Trigger background sync
  async triggerSync(tag: string): Promise<boolean> {
    if (!this.registration || !this.registration.active) {
      return false
    }

    try {
      await this.registration.sync.register(tag)
      return true
    } catch (error) {
      console.error('Error triggering background sync:', error)
      return false
    }
  }

  // Send message to service worker
  sendMessage(message: any): void {
    if (this.registration && this.registration.active) {
      this.registration.active.postMessage(message)
    }
  }

  // Check if service worker is active
  isActive(): boolean {
    return this.isRegistered && 
           this.registration !== null && 
           this.registration.active !== null
  }

  // Get service worker registration
  getRegistration(): ServiceWorkerRegistration | null {
    return this.registration
  }

  // Event emitter methods
  on(event: string, callback: (data?: any) => void): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, [])
    }
    this.eventListeners.get(event)!.push(callback)
  }

  off(event: string, callback: (data?: any) => void): void {
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      const index = listeners.indexOf(callback)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }

  private emit(event: string, data?: any): void {
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      listeners.forEach(callback => callback(data))
    }
  }

  // Unregister service worker
  async unregister(): Promise<boolean> {
    if (!this.registration) {
      return false
    }

    try {
      await this.registration.unregister()
      this.registration = null
      this.isRegistered = false
      console.log('Service Worker unregistered successfully')
      return true
    } catch (error) {
      console.error('Service Worker unregistration failed:', error)
      return false
    }
  }

  // Skip waiting for new service worker
  skipWaiting(): void {
    if (this.registration && this.registration.waiting) {
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' })
    }
  }

  // Get network status from service worker
  async getNetworkStatus(): Promise<{ online: boolean; lastSeen: string | null }> {
    if (!this.registration || !this.registration.active) {
      return { online: navigator.onLine, lastSeen: null }
    }

    try {
      // Send message to service worker to get network status
      this.registration.active.postMessage({ type: 'GET_NETWORK_STATUS' })

      // Wait for response
      return new Promise((resolve) => {
        const handleMessage = (event: MessageEvent) => {
          if (event.data.type === 'NETWORK_STATUS_RESPONSE') {
            navigator.serviceWorker.removeEventListener('message', handleMessage)
            resolve(event.data)
          }
        }

        navigator.serviceWorker.addEventListener('message', handleMessage)

        // Timeout after 5 seconds
        setTimeout(() => {
          navigator.serviceWorker.removeEventListener('message', handleMessage)
          resolve({ online: navigator.onLine, lastSeen: null })
        }, 5000)
      })
    } catch (error) {
      console.error('Error getting network status:', error)
      return { online: navigator.onLine, lastSeen: null }
    }
  }
}

// Create singleton instance
export const serviceWorkerManager = new ServiceWorkerManager()

// Auto-register service worker on page load
if (typeof window !== 'undefined') {
  // Register service worker when page loads
  window.addEventListener('load', async () => {
    await serviceWorkerManager.register()
  })
}

console.log('Service Worker Manager loaded')