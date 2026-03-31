// Demo Account Credentials for QR Tanki Platform
// Comprehensive demo setup for all user types and scenarios

export const DEMO_ACCOUNTS = {
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
      'Financial Oversight',
      'System Configuration',
      'Support Tickets',
      'Audit Logs'
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
      description: 'Regular user with 2 tanks and active subscription',
      tanks: [
        {
          id: 'tank-1',
          name: 'Main Water Tank',
          type: 'OVERHEAD',
          capacity: '1000 Liters',
          location: 'Rooftop - Building A',
          qrCode: 'QT-123456',
          hygieneScore: 4.5,
          lastCleaned: '2024-01-15',
          nextDue: '2024-02-15'
        },
        {
          id: 'tank-2',
          name: 'Backup Tank',
          type: 'UNDERGROUND',
          capacity: '500 Liters',
          location: 'Backyard',
          qrCode: 'QT-789012',
          hygieneScore: 3.8,
          lastCleaned: '2023-12-20',
          nextDue: '2024-01-20'
        }
      ],
      subscription: {
        plan: 'PREMIUM',
        status: 'ACTIVE',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        cleaningFrequency: 2
      },
      wallet: {
        balance: 2500.50,
        transactions: 15
      },
      bookings: [
        {
          id: 'booking-1',
          type: 'BASIC',
          date: '2024-01-15',
          status: 'COMPLETED',
          cleaner: 'Raj Kumar',
          cost: 699
        },
        {
          id: 'booking-2',
          type: 'DEEP',
          date: '2023-12-20',
          status: 'COMPLETED',
          cleaner: 'Amit Singh',
          cost: 899
        }
      ]
    },
    {
      email: 'society@qrtanki.com',
      password: 'Society@123',
      name: 'Society Manager',
      phone: '+91 98765 43212',
      role: 'USER',
      description: 'Society manager with group booking for 5 tanks',
      tanks: [
        {
          id: 'tank-3',
          name: 'Block A Tank',
          type: 'OVERHEAD',
          capacity: '2000 Liters',
          location: 'Block A Rooftop',
          qrCode: 'QT-345678',
          hygieneScore: 4.2,
          lastCleaned: '2024-01-10',
          nextDue: '2024-02-10'
        },
        {
          id: 'tank-4',
          name: 'Block B Tank',
          type: 'OVERHEAD',
          capacity: '2000 Liters',
          location: 'Block B Rooftop',
          qrCode: 'QT-456789',
          hygieneScore: 4.0,
          lastCleaned: '2024-01-12',
          nextDue: '2024-02-12'
        },
        {
          id: 'tank-5',
          name: 'Block C Tank',
          type: 'UNDERGROUND',
          capacity: '3000 Liters',
          location: 'Block C Basement',
          qrCode: 'QT-567890',
          hygieneScore: 3.9,
          lastCleaned: '2024-01-08',
          nextDue: '2024-02-08'
        },
        {
          id: 'tank-6',
          name: 'Block D Tank',
          type: 'OVERHEAD',
          capacity: '1500 Liters',
          location: 'Block D Rooftop',
          qrCode: 'QT-678901',
          hygieneScore: 4.1,
          lastCleaned: '2024-01-14',
          nextDue: '2024-02-14'
        },
        {
          id: 'tank-7',
          name: 'Club House Tank',
          type: 'UNDERGROUND',
          capacity: '5000 Liters',
          location: 'Club House Basement',
          qrCode: 'QT-789012',
          hygieneScore: 4.3,
          lastCleaned: '2024-01-05',
          nextDue: '2024-02-05'
        }
      ],
      groupBooking: {
        id: 'group-1',
        societyName: 'Sunshine Apartments',
        discountRate: 0.15,
        basePrice: 3495,
        discountedPrice: 2970,
        status: 'CONFIRMED',
        scheduledDate: '2024-02-01'
      },
      wallet: {
        balance: 5000.00,
        transactions: 25
      }
    },
    {
      email: 'emergency@qrtanki.com',
      password: 'Emergency@123',
      name: 'Emergency User',
      phone: '+91 98765 43213',
      role: 'USER',
      description: 'User who has used emergency services',
      tanks: [
        {
          id: 'tank-8',
          name: 'Critical Tank',
          type: 'OVERHEAD',
          capacity: '1500 Liters',
          location: 'Main Building Rooftop',
          qrCode: 'QT-890123',
          hygieneScore: 2.5,
          lastCleaned: '2024-01-01',
          nextDue: '2024-02-01'
        }
      ],
      emergencyRequests: [
        {
          id: 'emergency-1',
          urgencyLevel: 'CRITICAL',
          issueDescription: 'Tank overflow causing water damage',
          requestedAt: '2024-01-25T10:30:00Z',
          status: 'COMPLETED',
          totalCost: 1299,
          assignedCleaner: 'Vijay Kumar'
        }
      ],
      wallet: {
        balance: 1500.00,
        transactions: 8
      }
    },
    {
      email: 'wallet@qrtanki.com',
      password: 'Wallet@123',
      name: 'Wallet User',
      phone: '+91 98765 43214',
      role: 'USER',
      description: 'User with active wallet and transactions',
      tanks: [
        {
          id: 'tank-9',
          name: 'Home Tank',
          type: 'SINTANK',
          capacity: '1000 Liters',
          location: 'Home Rooftop',
          qrCode: 'QT-901234',
          hygieneScore: 4.6,
          lastCleaned: '2024-01-20',
          nextDue: '2024-02-20'
        }
      ],
      wallet: {
        balance: 3500.75,
        transactions: 32,
        escrowBalance: 999.00
      },
      transactions: [
        {
          id: 'txn-1',
          type: 'CREDIT',
          amount: 500,
          description: 'Earning from cleaning service',
          status: 'COMPLETED'
        },
        {
          id: 'txn-2',
          type: 'DEBIT',
          amount: 299,
          description: 'Payment for subscription',
          status: 'COMPLETED'
        },
        {
          id: 'txn-3',
          type: 'CREDIT',
          amount: 1500,
          description: 'Refund for cancelled booking',
          status: 'COMPLETED'
        }
      ]
    }
  ],

  // Cleaner Accounts - Different experience levels
  CLEANERS: [
    {
      email: 'cleaner@qrtanki.com',
      password: 'Cleaner@123',
      name: 'Expert Cleaner',
      phone: '+91 98765 43215',
      role: 'CLEANER',
      description: 'Expert cleaner with high rating and many jobs',
      experience: '5 years',
      serviceArea: 'Bangalore Urban',
      rating: 4.8,
      totalJobs: 150,
      isAvailable: true,
      bio: 'Professional water tank cleaning expert with 5+ years of experience. Specialized in deep cleaning and emergency services.',
      earnings: {
        total: 75000,
        thisMonth: 15000,
        pending: 2500
      },
      certifications: [
        {
          id: 'cert-1',
          name: 'Advanced Water Tank Cleaning',
          issuedAt: '2023-06-15',
          expiresAt: '2025-06-15',
          score: 95
        }
      ],
      cleaningRecords: [
        {
          id: 'record-1',
          tankId: 'tank-1',
          cleaningType: 'DEEP',
          cleanedAt: '2024-01-15',
          duration: 120,
          hygieneScore: 4.5,
          payment: 899
        }
      ]
    },
    {
      email: 'newcleaner@qrtanki.com',
      password: 'NewCleaner@123',
      name: 'New Cleaner',
      phone: '+91 98765 43216',
      role: 'CLEANER',
      description: 'New cleaner building reputation',
      experience: '1 year',
      serviceArea: 'Bangalore Suburban',
      rating: 4.2,
      totalJobs: 25,
      isAvailable: true,
      bio: 'Dedicated cleaner focused on quality service and customer satisfaction.',
      earnings: {
        total: 8000,
        thisMonth: 2000,
        pending: 500
      },
      traineeEnrollments: [
        {
          id: 'enroll-1',
          programName: 'Basic Water Tank Cleaning',
          status: 'COMPLETED',
          completedAt: '2023-12-01',
          score: 85
        }
      ]
    },
    {
      email: 'busycleaner@qrtanki.com',
      password: 'BusyCleaner@123',
      name: 'Busy Cleaner',
      phone: '+91 98765 43217',
      role: 'CLEANER',
      description: 'Busy cleaner with limited availability',
      experience: '3 years',
      serviceArea: 'Bangalore Central',
      rating: 4.5,
      totalJobs: 80,
      isAvailable: false,
      bio: 'Experienced cleaner with high demand. Currently booked for the next 2 weeks.',
      earnings: {
        total: 45000,
        thisMonth: 12000,
        pending: 3000
      }
    }
  ]
}

// Quick access credentials for easy testing
export const QUICK_DEMO = {
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
  },
  EMERGENCY: {
    email: 'emergency@qrtanki.com',
    password: 'Emergency@123'
  },
  WALLET: {
    email: 'wallet@qrtanki.com',
    password: 'Wallet@123'
  }
}

// Demo scenarios for testing
export const DEMO_SCENARIOS = {
  // Test complete user journey
  COMPLETE_JOURNEY: {
    name: 'Complete User Journey',
    description: 'Test the complete user journey from registration to service completion',
    steps: [
      '1. Register as new user',
      '2. Add a new tank',
      '3. Generate QR code',
      '4. Book cleaning service',
      '5. Make payment',
      '6. View cleaning record',
      '7. Leave feedback'
    ],
    testAccount: 'user@qrtanki.com'
  },

  // Test society booking
  SOCIETY_BOOKING: {
    name: 'Society Group Booking',
    description: 'Test group booking for society with multiple tanks',
    steps: [
      '1. Login as society manager',
      '2. Create group booking',
      '3. Add 5 tanks to booking',
      '4. Apply discount (15%)',
      '5. Schedule group cleaning',
      '6. Confirm booking'
    ],
    testAccount: 'society@qrtanki.com'
  },

  // Test emergency service
  EMERGENCY_SERVICE: {
    name: 'Emergency Service',
    description: 'Test emergency service request and priority response',
    steps: [
      '1. Login as regular user',
      '2. Request emergency service',
      '3. Select CRITICAL urgency',
      '4. Provide issue details',
      '5. Get priority assignment',
      '6. Track emergency response'
    ],
    testAccount: 'emergency@qrtanki.com'
  },

  // Test wallet functionality
  WALLET_FUNCTIONALITY: {
    name: 'Digital Wallet',
    description: 'Test complete wallet functionality including escrow',
    steps: [
      '1. Login as wallet user',
      '2. View wallet balance',
      '3. Add funds to wallet',
      '4. Make payment from wallet',
      '5. View transaction history',
      '6. Check escrow status'
    ],
    testAccount: 'wallet@qrtanki.com'
  },

  // Test cleaner experience
  CLEANER_EXPERIENCE: {
    name: 'Cleaner Experience',
    description: 'Test complete cleaner experience from dashboard to earnings',
    steps: [
      '1. Login as expert cleaner',
      '2. View dashboard and earnings',
      '3. Accept cleaning request',
      '4. Complete cleaning service',
      '5. Update cleaning record',
      '6. View earnings history'
    ],
    testAccount: 'cleaner@qrtanki.com'
  },

  // Test admin functionality
  ADMIN_FUNCTIONALITY: {
    name: 'Admin Functionality',
    description: 'Test complete admin functionality and system management',
    steps: [
      '1. Login as admin',
      '2. View system analytics',
      '3. Manage users',
      '4. Manage cleaners',
      '5. View financial reports',
      '6. Configure system settings'
    ],
    testAccount: 'admin@qrtanki.com'
  },

  // Test offline functionality
  OFFLINE_FUNCTIONALITY: {
    name: 'Offline Functionality',
    description: 'Test complete offline functionality and sync',
    steps: [
      '1. Go offline (disconnect from internet)',
      '2. Login with cached credentials',
      '3. View cached dashboard data',
      '4. Submit offline booking',
      '5. Go back online',
      '6. Verify automatic sync'
    ],
    testAccount: 'user@qrtanki.com'
  }
}

// Helper functions for demo testing
export const getDemoAccount = (type: string) => {
  switch (type) {
    case 'ADMIN':
      return DEMO_ACCOUNTS.ADMIN
    case 'CLEANER':
      return DEMO_ACCOUNTS.CLEANERS[0]
    case 'USER':
      return DEMO_ACCOUNTS.USERS[0]
    case 'SOCIETY':
      return DEMO_ACCOUNTS.USERS[1]
    case 'EMERGENCY':
      return DEMO_ACCOUNTS.USERS[2]
    case 'WALLET':
      return DEMO_ACCOUNTS.USERS[3]
    default:
      return DEMO_ACCOUNTS.USERS[0]
  }
}

export const getAllDemoAccounts = () => {
  return [
    DEMO_ACCOUNTS.ADMIN,
    ...DEMO_ACCOUNTS.USERS,
    ...DEMO_ACCOUNTS.CLEANERS
  ]
}

export const validateDemoCredentials = (email: string, password: string) => {
  const allAccounts = getAllDemoAccounts()
  
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

console.log('Demo account credentials loaded successfully')