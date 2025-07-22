import { createClient } from '@blinkdotnew/sdk'

// Initialize Blink client with project ID
export const blink = createClient({
  projectId: 'impact-project-room-v285w031',
  authRequired: false // This is a public submission form
})

// Validate Blink client is properly initialized
if (!blink) {
  console.error('Failed to initialize Blink client')
  throw new Error('Blink client initialization failed')
}

// Test basic connectivity - isAuthenticated() is synchronous, not async
try {
  const isAuth = blink.auth.isAuthenticated()
  console.log('Blink client initialized successfully. Auth status:', isAuth)
} catch (error) {
  console.warn('Blink client connectivity test failed:', error)
}