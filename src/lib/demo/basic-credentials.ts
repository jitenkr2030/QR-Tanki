// Simplified Demo Account Credentials for QR Tanki Platform
// Basic demo accounts for testing core functionality

export const BASIC_DEMO_ACCOUNTS = {
  // Admin Account - Full system access
  ADMIN: {
    email: 'admin@qrtanki.com',
    password: 'Admin@123',
    name: 'Admin User',
    phone: '+91 98765 43210',
    role: 'ADMIN',
    description: 'Full system administrator with access to all features',
    features: [
      'User Management',
      'System Analytics',
      'Service Provider Management',
      'System Configuration'
    ]
  },

  // Cleaner Account - Service provider
  CLEANER: {
    email: 'cleaner@qrtanki.com',
    password: 'Cleaner@123',
    name: 'Expert Cleaner',
    phone: '+91 98765 43215',
    role: 'CLEANER',
    description: 'Expert cleaner with high rating and experience',
    features: [
      'Dashboard Access',
      'Earnings Tracking',
      'Job Management',
      'Profile Management'
    ]
  },

  // Regular User Accounts - Different scenarios
  USERS: [
    {
      email: 'user@qrtanki.com',
      password: 'User@123',
      name: 'Regular User',
      phone: '+91 98765 43211',
      role: 'USER',
      description: 'Regular user with 2 demo tanks',
      features: [
        'Tank Management',
        'QR Code Generation',
        'Booking Services',
        'View History'
      ]
    },
    {
      email: 'society@qrtanki.com',
      password: 'Society@123',
      name: 'Society Manager',
      phone: '+91 98765 43212',
      role: 'USER',
      description: 'Society manager with multiple demo tanks',
      features: [
        'Multiple Tank Management',
        'Group Booking',
        'Society Dashboard',
        'Bulk Operations'
      ]
    }
  ]
}

// Quick access credentials for easy testing
export const QUICK_BASIC_DEMO = {
  ADMIN: {
    email: 'admin@qrtanki.com',
    password: 'Admin@123'
  },
  USER: {
    email: 'user@qrtanki.com',
    password: 'User@123'
  },
  CLEANER: {
    email: 'cleaner@qrtanki.com',
    password: 'Cleaner@123'
  },
  SOCIETY: {
    email: 'society@qrtanki.com',
    password: 'Society@123'
  }
}

// Demo scenarios for testing
export const BASIC_DEMO_SCENARIOS = {
  // Test complete user journey
  COMPLETE_JOURNEY: {
    name: 'Complete User Journey',
    description: 'Test the complete user journey from login to tank management',
    steps: [
      '1. Login as regular user',
      '2. View dashboard and statistics',
      '3. Add a new tank',
      '4. Generate QR code for tank',
      '5. View tank details and status',
      '6. Test navigation between pages'
    ],
    testAccount: 'user@qrtanki.com'
  },

  // Test society management
  SOCIETY_MANAGEMENT: {
    name: 'Society Management',
    description: 'Test society management with multiple tanks',
    steps: [
      '1. Login as society manager',
      '2. View society dashboard',
      '3. Manage multiple tanks',
      '4. Test group booking features',
      '5. View society analytics'
    ],
    testAccount: 'society@qrtanki.com'
  },

  // Test cleaner experience
  CLEANER_EXPERIENCE: {
    name: 'Cleaner Experience',
    description: 'Test complete cleaner experience',
    steps: [
      '1. Login as expert cleaner',
      '2. View cleaner dashboard',
      '3. Test earnings tracking',
      '4. Test profile management',
      '5. Test availability management'
    ],
    testAccount: 'cleaner@qrtanki.com'
  },

  // Test admin functionality
  ADMIN_FUNCTIONALITY: {
    name: 'Admin Functionality',
    description: 'Test complete admin functionality',
    steps: [
      '1. Login as administrator',
      '2. View admin dashboard',
      '3. Test user management',
      '4. Test system configuration',
      '5. Test analytics and reporting'
    ],
    testAccount: 'admin@qrtanki.com'
  },

  // Test offline functionality
  OFFLINE_FUNCTIONALITY: {
    name: 'Offline Functionality',
    description: 'Test complete offline functionality',
    steps: [
      '1. Login with any demo account',
      '2. Disconnect from internet',
      '3. Test offline navigation',
      '4. Test cached data access',
      '5. Reconnect and test sync'
    ],
    testAccount: 'user@qrtanki.com'
  }
}

// Helper functions for demo testing
export const getBasicDemoAccount = (type: string) => {
  switch (type) {
    case 'ADMIN':
      return BASIC_DEMO_ACCOUNTS.ADMIN
    case 'CLEANER':
      return BASIC_DEMO_ACCOUNTS.CLEANER
    case 'USER':
      return BASIC_DEMO_ACCOUNTS.USERS[0]
    case 'SOCIETY':
      return BASIC_DEMO_ACCOUNTS.USERS[1]
    default:
      return BASIC_DEMO_ACCOUNTS.USERS[0]
  }
}

export const getAllBasicDemoAccounts = () => {
  return [
    BASIC_DEMO_ACCOUNTS.ADMIN,
    ...BASIC_DEMO_ACCOUNTS.USERS,
    BASIC_DEMO_ACCOUNTS.CLEANER
  ]
}

export const validateBasicDemoCredentials = (email: string, password: string) => {
  const allAccounts = getAllBasicDemoAccounts()
  
  for (const account of allAccounts) {
    if (account.email === email && account.password === password) {
      return {
        valid: true,
        account: account
      }
    }
  }
  
  return {
    valid: false,
    account: null
  }
}

console.log('Basic demo account credentials loaded successfully')