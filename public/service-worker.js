// Service Worker for QR Tanki PWA
const CACHE_NAME = 'qrtanki-v1'
const STATIC_CACHE_NAME = 'qrtanki-static-v1'
const DYNAMIC_CACHE_NAME = 'qrtanki-dynamic-v1'

// Static assets to cache
const STATIC_ASSETS = [
  '/',
  '/auth/signin',
  '/auth/signup',
  '/dashboard',
  '/tanks',
  '/bookings',
  '/society',
  '/emergency',
  '/wallet',
  '/subscriptions',
  '/favicon.svg',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/og-image.png'
]

// API endpoints to cache
const API_ENDPOINTS = [
  '/api/tanks',
  '/api/bookings',
  '/api/subscriptions',
  '/api/qrcode',
  '/api/feedback'
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...')
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        console.log('Service Worker: Static assets cached successfully')
        return self.skipWaiting()
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...')
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
              console.log('Service Worker: Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('Service Worker: Old caches cleaned up')
        return self.clients.claim()
      })
  )
})

// Fetch event - handle network requests
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)
  
  // Handle different request types
  if (isStaticAsset(request)) {
    event.respondWith(handleStaticRequest(request))
  } else if (isAPIRequest(request)) {
    event.respondWith(handleAPIRequest(request))
  } else {
    event.respondWith(handleNavigationRequest(request))
  }
})

// Check if request is for static asset
function isStaticAsset(request) {
  return STATIC_ASSETS.some(asset => request.url.includes(asset)) ||
         request.url.includes('.js') ||
         request.url.includes('.css') ||
         request.url.includes('.png') ||
         request.url.includes('.jpg') ||
         request.url.includes('.svg') ||
         request.url.includes('.ico') ||
         request.url.includes('.woff') ||
         request.url.includes('.woff2')
}

// Check if request is for API
function isAPIRequest(request) {
  return API_ENDPOINTS.some(endpoint => request.url.includes(endpoint))
}

// Handle static asset requests
async function handleStaticRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      // Cache successful response
      const cache = await caches.open(STATIC_CACHE_NAME)
      cache.put(request, networkResponse.clone())
      return networkResponse
    } else {
      // Network failed, try cache
      const cachedResponse = await caches.match(request)
      if (cachedResponse) {
        return cachedResponse
      } else {
        // Return offline page for navigation requests
        return new Response('Offline - No cached version available', {
          status: 503,
          statusText: 'Service Unavailable'
        })
      }
    }
  } catch (error) {
    console.log('Service Worker: Network error, trying cache:', error)
    
    // Network failed, try cache
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    } else {
      // Return offline page for navigation requests
      if (request.mode === 'navigate') {
        return caches.match('/offline.html')
      } else {
        return new Response('Offline - No cached version available', {
          status: 503,
          statusText: 'Service Unavailable'
        })
      }
    }
  }
}

// Handle API requests
async function handleAPIRequest(request) {
  const url = new URL(request.url)
  const cacheKey = `${DYNAMIC_CACHE_NAME}-${url.pathname}`
  
  try {
    // Try network first for API requests
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      // Cache successful API response
      const cache = await caches.open(DYNAMIC_CACHE_NAME)
      cache.put(cacheKey, networkResponse.clone())
      return networkResponse
    } else {
      // Network failed, try cache
      const cachedResponse = await caches.match(cacheKey)
      if (cachedResponse) {
        // Return cached data with offline indicator
        const modifiedResponse = new Response(cachedResponse.body, {
          status: 200,
          statusText: 'OK (Cached)',
          headers: {
            ...Object.fromEntries(cachedResponse.headers),
            'X-Offline-Cache': 'true'
          }
        })
        return modifiedResponse
      } else {
        // Return offline response
        return new Response(JSON.stringify({
          error: 'Offline - No cached data available',
          offline: true,
          cached: false
        }), {
          status: 503,
          statusText: 'Service Unavailable',
          headers: {
            'Content-Type': 'application/json',
            'X-Offline-Cache': 'true'
          }
        })
      }
    }
  } catch (error) {
    console.log('Service Worker: Network error for API, trying cache:', error)
    
    // Network failed, try cache
    const cachedResponse = await caches.match(cacheKey)
    if (cachedResponse) {
      // Return cached data with offline indicator
      const modifiedResponse = new Response(cachedResponse.body, {
        status: 200,
        statusText: 'OK (Cached)',
        headers: {
          ...Object.fromEntries(cachedResponse.headers),
          'X-Offline-Cache': 'true'
        }
      })
      return modifiedResponse
    } else {
      // Return offline response
      return new Response(JSON.stringify({
        error: 'Offline - No cached data available',
        offline: true,
        cached: false
      }), {
        status: 503,
        statusText: 'Service Unavailable',
        headers: {
          'Content-Type': 'application/json',
          'X-Offline-Cache': 'true'
        }
      })
    }
  }
}

// Handle navigation requests
async function handleNavigationRequest(request) {
  try {
    // Try network first for navigation
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      // Cache successful navigation response
      const cache = await caches.open(STATIC_CACHE_NAME)
      cache.put(request, networkResponse.clone())
      return networkResponse
    } else {
      // Network failed, try cache
      const cachedResponse = await caches.match(request)
      if (cachedResponse) {
        return cachedResponse
      } else {
        // Return offline page
        return caches.match('/offline.html')
      }
    }
  } catch (error) {
    console.log('Service Worker: Network error for navigation, trying cache:', error)
    
    // Network failed, try cache
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    } else {
      // Return offline page
      return caches.match('/offline.html')
    }
  }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered')
  
  if (event.tag === 'background-sync-bookings') {
    event.waitUntil(syncBookings())
  } else if (event.tag === 'background-sync-payments') {
    event.waitUntil(syncPayments())
  } else if (event.tag === 'background-sync-feedback') {
    event.waitUntil(syncFeedback())
  }
})

// Sync offline bookings
async function syncBookings() {
  try {
    // Get offline bookings from IndexedDB
    const offlineBookings = await getOfflineBookings()
    
    for (const booking of offlineBookings) {
      try {
        const response = await fetch('/api/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(booking.data)
        })
        
        if (response.ok) {
          // Remove from offline storage after successful sync
          await removeOfflineBooking(booking.id)
          console.log('Service Worker: Booking synced successfully:', booking.id)
        } else {
          console.log('Service Worker: Failed to sync booking:', booking.id)
        }
      } catch (error) {
        console.log('Service Worker: Error syncing booking:', error)
      }
    }
  } catch (error) {
    console.log('Service Worker: Error in syncBookings:', error)
  }
}

// Sync offline payments
async function syncPayments() {
  try {
    // Get offline payments from IndexedDB
    const offlinePayments = await getOfflinePayments()
    
    for (const payment of offlinePayments) {
      try {
        const response = await fetch('/api/payments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payment.data)
        })
        
        if (response.ok) {
          // Remove from offline storage after successful sync
          await removeOfflinePayment(payment.id)
          console.log('Service Worker: Payment synced successfully:', payment.id)
        } else {
          console.log('Service Worker: Failed to sync payment:', payment.id)
        }
      } catch (error) {
        console.log('Service Worker: Error syncing payment:', error)
      }
    }
  } catch (error) {
    console.log('Service Worker: Error in syncPayments:', error)
  }
}

// Sync offline feedback
async function syncFeedback() {
  try {
    // Get offline feedback from IndexedDB
    const offlineFeedback = await getOfflineFeedback()
    
    for (const feedback of offlineFeedback) {
      try {
        const response = await fetch('/api/feedback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(feedback.data)
        })
        
        if (response.ok) {
          // Remove from offline storage after successful sync
          await removeOfflineFeedback(feedback.id)
          console.log('Service Worker: Feedback synced successfully:', feedback.id)
        } else {
          console.log('Service Worker: Failed to sync feedback:', feedback.id)
        }
      } catch (error) {
        console.log('Service Worker: Error syncing feedback:', error)
      }
    }
  } catch (error) {
    console.log('Service Worker: Error in syncFeedback:', error)
  }
}

// Push notification event
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received')
  
  const options = {
    body: event.data?.text() || 'New notification from QR Tanki',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    vibrate: [100, 50, 100],
    data: event.data?.json(),
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: '/icons/view.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/icons/dismiss.png'
      }
    ]
  }
  
  event.waitUntil(
    self.registration.showNotification('QR Tanki', options)
  )
})

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked')
  
  event.notification.close()
  
  if (event.action === 'view') {
    // Open the app to relevant page
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})

// Message event for communication with app
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received:', event.data)
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  } else if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME })
  } else if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.delete(STATIC_CACHE_NAME)
        .then(() => caches.delete(DYNAMIC_CACHE_NAME))
        .then(() => {
          event.ports[0].postMessage({ success: true })
        })
    )
  }
})

// IndexedDB helper functions (simplified for demo)
async function getOfflineBookings() {
  // In a real implementation, this would use IndexedDB
  // For demo, return empty array
  return []
}

async function removeOfflineBooking(id) {
  // In a real implementation, this would remove from IndexedDB
  console.log('Removing offline booking:', id)
}

async function getOfflinePayments() {
  // In a real implementation, this would use IndexedDB
  // For demo, return empty array
  return []
}

async function removeOfflinePayment(id) {
  // In a real implementation, this would remove from IndexedDB
  console.log('Removing offline payment:', id)
}

async function getOfflineFeedback() {
  // In a real implementation, this would use IndexedDB
  // For demo, return empty array
  return []
}

async function removeOfflineFeedback(id) {
  // In a real implementation, this would remove from IndexedDB
  console.log('Removing offline feedback:', id)
}

console.log('Service Worker: Loaded and ready')