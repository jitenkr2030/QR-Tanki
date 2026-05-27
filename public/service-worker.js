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
  '/scan',
  '/bookings',
  '/society',
  '/emergency',
  '/wallet',
  '/subscriptions',
  '/favicon.svg',
  '/manifest.json',
  '/offline.html',
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

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

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
  return STATIC_ASSETS.some(asset => request.url.endsWith(asset)) ||
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
    // Try cache first for static assets
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      // Update cache in background
      fetch(request).then((networkResponse) => {
        if (networkResponse.ok) {
          caches.open(STATIC_CACHE_NAME).then((cache) => {
            cache.put(request, networkResponse)
          })
        }
      }).catch(() => {})
      return cachedResponse
    }

    // No cache, try network
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME)
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    console.log('Service Worker: Static asset offline:', request.url)
    return new Response('Offline - No cached version available', {
      status: 503,
      statusText: 'Service Unavailable'
    })
  }
}

// Handle navigation requests
async function handleNavigationRequest(request) {
  try {
    // Try network first for navigation
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME)
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    console.log('Service Worker: Navigation offline, trying cache:', request.url)

    // Try exact cache match
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }

    // Try network-only fallback for known routes
    const url = new URL(request.url)
    const cachedPage = await caches.match(url.pathname)
    if (cachedPage) {
      return cachedPage
    }

    // Return offline page
    const offlinePage = await caches.match('/offline.html')
    if (offlinePage) {
      return offlinePage
    }

    // Last resort
    return new Response('<!DOCTYPE html><html><body><h1>You are offline</h1><p>Please check your internet connection and try again.</p></body></html>', {
      status: 503,
      headers: { 'Content-Type': 'text/html' }
    })
  }
}

// Handle API requests
async function handleAPIRequest(request) {
  const url = new URL(request.url)
  const cacheKey = request.url

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
        return new Response(cachedResponse.body, {
          status: 200,
          statusText: 'OK (Cached)',
          headers: {
            ...Object.fromEntries(cachedResponse.headers),
            'X-Offline-Cache': 'true'
          }
        })
      }

      return new Response(JSON.stringify({
        error: 'Offline - No cached data available',
        offline: true,
        cached: false
      }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  } catch (error) {
    console.log('Service Worker: API offline, trying cache:', request.url)

    const cachedResponse = await caches.match(cacheKey)
    if (cachedResponse) {
      return new Response(cachedResponse.body, {
        status: 200,
        statusText: 'OK (Cached)',
        headers: {
          ...Object.fromEntries(cachedResponse.headers),
          'X-Offline-Cache': 'true'
        }
      })
    }

    return new Response(JSON.stringify({
      error: 'Offline - No cached data available',
      offline: true,
      cached: false
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
