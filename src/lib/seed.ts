// Database Seed Script for QR Tanki Platform with Neon Database
// Populates database with complete demo data for functional application

import { PrismaClient } from '@prisma/client'

// Create a single PrismaClient instance
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient } | undefined

function getPrismaClient() {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient()
  }
  return globalForPrisma.prisma
}

const prisma = getPrismaClient()

async function seedDatabase() {
  console.log('🌱 Starting QR Tanki database seeding with Neon...')
  
  try {
    // Test database connection
    await testDatabaseConnection()
    
    // Clean up existing data
    await cleanupDatabase()
    
    // Create demo data
    await createDemoUsers()
    await createDemoCleaners()
    await createDemoTanks()
    await createDemoQRCodes()
    await createDemoSubscriptions()
    await createDemoCleaningRequests()
    await createDemoCleaningRecords()
    await createDemoPayments()
    await createDemoFeedback()
    await createDemoEarnings()
    await createDemoWallets()
    await createDemoTransactions()
    
    console.log('✅ Database seeded successfully!')
    console.log('\n📱 Demo Account Credentials:')
    console.log('=====================================')
    
    // Display demo credentials
    displayDemoCredentials()
    
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

async function testDatabaseConnection() {
  console.log('🔗 Testing Neon database connection...')
  
  try {
    await prisma.$queryRaw`SELECT 1`
    console.log('✅ Database connection successful')
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    throw error
  }
}

async function cleanupDatabase() {
  console.log('🧹 Cleaning up existing data...')
  
  // Delete in order to respect foreign key constraints
  const tableNames = [
    'feedback',
    'earning',
    'transaction',
    'wallet_balance',
    'cleaning_record',
    'cleaning_request',
    'payment',
    'subscription',
    'qr_code',
    'tank',
    'cleaner',
    'user'
  ]
  
  for (const tableName of tableNames) {
    try {
      await prisma.$executeRawUnsafe(`DELETE FROM "${tableName}"`)
      console.log(`✅ Cleaned table: ${tableName}`)
    } catch (error) {
      console.log(`⚠️ Could not clean table: ${tableName} - ${error.message}`)
    }
  }
}

async function createDemoUsers() {
  console.log('👥 Creating demo users...')
  
  const users = [
    {
      email: 'admin@qrtanki.com',
      name: 'Admin User',
      phone: '+91 98765 43210',
      role: 'ADMIN',
      isVerified: true
    },
    {
      email: 'cleaner@qrtanki.com',
      name: 'Expert Cleaner',
      phone: '+91 98765 43215',
      role: 'CLEANER',
      isVerified: true
    },
    {
      email: 'user@qrtanki.com',
      name: 'Regular User',
      phone: '+91 98765 43211',
      role: 'USER',
      isVerified: true
    },
    {
      email: 'society@qrtanki.com',
      name: 'Society Manager',
      phone: '+91 98765 43212',
      role: 'USER',
      isVerified: true
    },
    {
      email: 'emergency@qrtanki.com',
      name: 'Emergency User',
      phone: '+91 98765 43213',
      role: 'USER',
      isVerified: true
    },
    {
      email: 'wallet@qrtanki.com',
      name: 'Wallet User',
      phone: '+91 98765 43214',
      role: 'USER',
      isVerified: true
    }
  ]
  
  for (const userData of users) {
    const user = await prisma.user.create({
      data: {
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
    console.log(`✅ Created user: ${user.email}`)
  }
}

async function createDemoCleaners() {
  console.log('👨‍🔧 Creating demo cleaners...')
  
  const cleanerUser = await prisma.user.findUnique({
    where: { email: 'cleaner@qrtanki.com' }
  })
  
  if (cleanerUser) {
    const cleaner = await prisma.cleaner.create({
      data: {
        userId: cleanerUser.id,
        experience: '5 years',
        serviceArea: 'Bangalore Urban',
        rating: 4.8,
        totalJobs: 150,
        isAvailable: true,
        bio: 'Professional water tank cleaning expert with 5+ years of experience. Specialized in deep cleaning and emergency services.',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
    console.log(`✅ Created cleaner: ${cleanerUser.email}`)
  }
}

async function createDemoTanks() {
  console.log('🏗️ Creating demo tanks...')
  
  const users = await prisma.user.findMany({
    where: { role: 'USER' }
  })
  
  const tankData = [
    // Regular User Tanks
    {
      userId: users.find(u => u.email === 'user@qrtanki.com')?.id,
      name: 'Main Water Tank',
      type: 'OVERHEAD',
      capacity: '1000 Liters',
      location: 'Rooftop - Building A',
      installationDate: new Date('2023-01-01'),
      lastCleanedDate: new Date('2024-01-15'),
      nextDueDate: new Date('2024-02-15'),
      hygieneScore: 4.5,
      isActive: true
    },
    {
      userId: users.find(u => u.email === 'user@qrtanki.com')?.id,
      name: 'Backup Tank',
      type: 'UNDERGROUND',
      capacity: '500 Liters',
      location: 'Backyard',
      installationDate: new Date('2023-01-01'),
      lastCleanedDate: new Date('2023-12-20'),
      nextDueDate: new Date('2024-01-20'),
      hygieneScore: 3.8,
      isActive: true
    },
    // Society Manager Tanks
    {
      userId: users.find(u => u.email === 'society@qrtanki.com')?.id,
      name: 'Block A Tank',
      type: 'OVERHEAD',
      capacity: '2000 Liters',
      location: 'Rooftop - Block A',
      installationDate: new Date('2023-01-01'),
      lastCleanedDate: new Date('2024-01-10'),
      nextDueDate: new Date('2024-02-10'),
      hygieneScore: 4.2,
      isActive: true
    },
    {
      userId: users.find(u => u.email === 'society@qrtanki.com')?.id,
      name: 'Block B Tank',
      type: 'OVERHEAD',
      capacity: '2000 Liters',
      location: 'Rooftop - Block B',
      installationDate: new Date('2023-01-01'),
      lastCleanedDate: new Date('2024-01-12'),
      nextDueDate: new Date('2024-02-12'),
      hygieneScore: 4.0,
      isActive: true
    },
    {
      userId: users.find(u => u.email === 'society@qrtanki.com')?.id,
      name: 'Block C Tank',
      type: 'UNDERGROUND',
      capacity: '3000 Liters',
      location: 'Basement - Block C',
      installationDate: new Date('2023-01-01'),
      lastCleanedDate: new Date('2024-01-08'),
      nextDueDate: new Date('2024-02-08'),
      hygieneScore: 3.9,
      isActive: true
    },
    // Emergency User Tank
    {
      userId: users.find(u => u.email === 'emergency@qrtanki.com')?.id,
      name: 'Emergency Tank',
      type: 'OVERHEAD',
      capacity: '1500 Liters',
      location: 'Main Building Rooftop',
      installationDate: new Date('2023-01-01'),
      lastCleanedDate: new Date('2024-01-01'),
      nextDueDate: new Date('2024-02-01'),
      hygieneScore: 2.5,
      isActive: true
    },
    // Wallet User Tank
    {
      userId: users.find(u => u.email === 'wallet@qrtanki.com')?.id,
      name: 'Wallet Tank',
      type: 'SINTANK',
      capacity: '1000 Liters',
      location: 'Home Rooftop',
      installationDate: new Date('2023-01-01'),
      lastCleanedDate: new Date('2024-01-20'),
      nextDueDate: new Date('2024-02-20'),
      hygieneScore: 4.6,
      isActive: true
    }
  ]
  
  for (const tank of tankData) {
    if (tank.userId) {
      const createdTank = await prisma.tank.create({
        data: {
          ...tank,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
      console.log(`✅ Created tank: ${createdTank.name}`)
    }
  }
}

async function createDemoQRCodes() {
  console.log('📱 Creating demo QR codes...')
  
  const tanks = await prisma.tank.findMany()
  
  for (const tank of tanks) {
    await prisma.qrCode.create({
      data: {
        code: `QT-${tank.id.slice(-6).toUpperCase()}`,
        tankId: tank.id,
        isGenerated: true,
        isPaid: true,
        generatedAt: new Date('2024-01-01'),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
    console.log(`✅ Created QR code for: ${tank.name}`)
  }
}

async function createDemoSubscriptions() {
  console.log('💎 Creating demo subscriptions...')
  
  const users = await prisma.user.findMany({
    where: { 
      role: 'USER',
      email: { in: ['user@qrtanki.com', 'society@qrtanki.com'] }
    }
  })
  
  const subscriptionData = [
    {
      userId: users.find(u => u.email === 'user@qrtanki.com')?.id,
      plan: 'PREMIUM',
      amount: 599,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      isActive: true,
      autoRenew: false,
      cleaningFrequency: 2
    },
    {
      userId: users.find(u => u.email === 'society@qrtanki.com')?.id,
      plan: 'PREMIUM',
      amount: 599,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      isActive: true,
      autoRenew: false,
      cleaningFrequency: 4
    }
  ]
  
  for (const sub of subscriptionData) {
    if (sub.userId) {
      const subscription = await prisma.subscription.create({
        data: {
          ...sub,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
      console.log(`✅ Created subscription for user: ${sub.userId}`)
    }
  }
}

async function createDemoCleaningRequests() {
  console.log('📅 Creating demo cleaning requests...')
  
  const tanks = await prisma.tank.findMany()
  const users = await prisma.user.findMany({ where: { role: 'USER' } })
  const cleaner = await prisma.cleaner.findFirst()
  
  const requestData = [
    {
      userId: users.find(u => u.email === 'user@qrtanki.com')?.id,
      tankId: tanks.find(t => t.name === 'Main Water Tank')?.id,
      cleaningType: 'BASIC',
      requestedDate: new Date('2024-01-15'),
      scheduledDate: new Date('2024-01-15'),
      preferredTime: '10:00 AM',
      status: 'COMPLETED',
      urgencyLevel: 1
    },
    {
      userId: users.find(u => u.email === 'user@qrtanki.com')?.id,
      tankId: tanks.find(t => t.name === 'Backup Tank')?.id,
      cleaningType: 'DEEP',
      requestedDate: new Date('2023-12-20'),
      scheduledDate: new Date('2023-12-20'),
      preferredTime: '2:00 PM',
      status: 'COMPLETED',
      urgencyLevel: 1
    },
    {
      userId: users.find(u => u.email === 'society@qrtanki.com')?.id,
      tankId: tanks.find(t => t.name === 'Block A Tank')?.id,
      cleaningType: 'BASIC',
      requestedDate: new Date('2024-01-10'),
      scheduledDate: new Date('2024-01-10'),
      preferredTime: '9:00 AM',
      status: 'COMPLETED',
      urgencyLevel: 1
    },
    {
      userId: users.find(u => u.email === 'society@qrtanki.com')?.id,
      tankId: tanks.find(t => t.name === 'Block B Tank')?.id,
      cleaningType: 'DEEP',
      requestedDate: new Date('2024-01-12'),
      scheduledDate: new Date('2024-01-12'),
      preferredTime: '11:00 AM',
      status: 'COMPLETED',
      urgencyLevel: 1
    },
    {
      userId: users.find(u => u.email === 'emergency@qrtanki.com')?.id,
      tankId: tanks.find(t => t.name === 'Emergency Tank')?.id,
      cleaningType: 'EMERGENCY',
      requestedDate: new Date('2024-01-25'),
      scheduledDate: new Date('2024-01-25'),
      preferredTime: 'ASAP',
      status: 'COMPLETED',
      urgencyLevel: 3,
      assignedCleanerId: cleaner?.id
    },
    {
      userId: users.find(u => u.email === 'wallet@qrtanki.com')?.id,
      tankId: tanks.find(t => t.name === 'Wallet Tank')?.id,
      cleaningType: 'BASIC',
      requestedDate: new Date('2024-01-20'),
      scheduledDate: new Date('2024-01-20'),
      preferredTime: '3:00 PM',
      status: 'COMPLETED',
      urgencyLevel: 1
    }
  ]
  
  for (const request of requestData) {
    if (request.userId && request.tankId) {
      const cleaningRequest = await prisma.cleaningRequest.create({
        data: {
          ...request,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
      console.log(`✅ Created cleaning request: ${request.cleaningType}`)
    }
  }
}

async function createDemoCleaningRecords() {
  console.log('🧹 Creating demo cleaning records...')
  
  const requests = await prisma.cleaningRequest.findMany({
    include: {
      tank: true,
      user: true
    }
  })
  
  const cleaner = await prisma.cleaner.findFirst()
  
  for (const request of requests) {
    if (cleaner) {
      const record = await prisma.cleaningRecord.create({
        data: {
          tankId: request.tankId,
          cleanerId: cleaner.id,
          requestId: request.id,
          cleaningType: request.cleaningType,
          cleanedAt: request.scheduledDate,
          duration: request.cleaningType === 'BASIC' ? 90 : 120,
          beforePhotos: '["photo1.jpg", "photo2.jpg"]',
          afterPhotos: '["photo3.jpg", "photo4.jpg"]',
          notes: 'Cleaning completed successfully',
          hygieneScore: request.cleaningType === 'BASIC' ? 4.5 : 4.2,
          isVerified: true,
          verifiedBy: 'admin',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
      console.log(`✅ Created cleaning record for: ${request.tank.name}`)
    }
  }
}

async function createDemoPayments() {
  console.log('💳 Creating demo payments...')
  
  const requests = await prisma.cleaningRequest.findMany()
  const subscriptions = await prisma.subscription.findMany()
  
  // Payments for cleaning requests
  for (const request of requests) {
    const amount = request.cleaningType === 'BASIC' ? 699 : 
                   request.cleaningType === 'DEEP' ? 899 : 
                   request.cleaningType === 'EMERGENCY' ? 1299 : 699
    
    await prisma.payment.create({
      data: {
        userId: request.userId,
        amount,
        type: 'CLEANING',
        status: 'COMPLETED',
        paymentMethod: 'UPI',
        transactionId: `txn-${Date.now()}-${request.id}`,
        requestId: request.id,
        paidAt: request.scheduledDate,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
    console.log(`✅ Created payment for: ${request.cleaningType}`)
  }
  
  // Payments for subscriptions
  for (const subscription of subscriptions) {
    await prisma.payment.create({
      data: {
        userId: subscription.userId,
        amount: subscription.amount,
        type: 'SUBSCRIPTION',
        status: 'COMPLETED',
        paymentMethod: 'UPI',
        transactionId: `txn-sub-${Date.now()}-${subscription.id}`,
        subscriptionId: subscription.id,
        paidAt: subscription.startDate,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
    console.log(`✅ Created subscription payment`)
  }
}

async function createDemoFeedback() {
  console.log('⭐ Creating demo feedback...')
  
  const records = await prisma.cleaningRecord.findMany({
    include: {
      user: true,
      cleaner: {
        include: {
          user: true
        }
      }
    }
  })
  
  for (const record of records) {
    await prisma.feedback.create({
      data: {
        userId: record.user.id,
        cleaningRecordId: record.id,
        cleanerId: record.cleanerId,
        rating: 5,
        comment: 'Excellent service! Very professional and thorough cleaning.',
        isPublic: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
    console.log(`✅ Created feedback for: ${record.tankId}`)
  }
}

async function createDemoEarnings() {
  console.log('💰 Creating demo earnings...')
  
  const cleaner = await prisma.cleaner.findFirst()
  
  if (cleaner) {
    await prisma.earning.create({
      data: {
        cleanerId: cleaner.id,
        amount: 15000,
        commission: 3000,
        netAmount: 12000,
        earnedAt: new Date(),
        isPaid: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
    console.log(`✅ Created earnings for: ${cleaner.userId}`)
  }
}

async function createDemoWallets() {
  console.log('💼 Creating demo wallets...')
  
  const users = await prisma.user.findMany({
    where: { 
      role: 'USER',
      email: { in: ['user@qrtanki.com', 'wallet@qrtanki.com'] }
    }
  })
  
  for (const user of users) {
    const wallet = await prisma.wallet.create({
      data: {
        userId: user.id,
        balance: user.email === 'wallet@qrtanki.com' ? 3500.75 : 2500.50,
        currency: 'INR',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
    
    // Create initial wallet balance
    await prisma.walletBalance.create({
      data: {
        walletId: wallet.id,
        balance: wallet.balance,
        transactionType: 'CREDIT',
        description: 'Initial wallet balance',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
    
    console.log(`✅ Created wallet for: ${user.email}`)
  }
}

async function createDemoTransactions() {
  console.log('💸 Creating demo transactions...')
  
  const wallets = await prisma.wallet.findMany()
  
  const transactions = [
    {
      walletId: wallets[0]?.id,
      amount: 500,
      type: 'CREDIT',
      description: 'Earning from cleaning service',
      status: 'COMPLETED'
    },
    {
      walletId: wallets[0]?.id,
      amount: 299,
      type: 'DEBIT',
      description: 'Payment for subscription',
      status: 'COMPLETED'
    },
    {
      walletId: wallets[1]?.id,
      amount: 1500,
      type: 'CREDIT',
      description: 'Refund for cancelled booking',
      status: 'COMPLETED'
    }
  ]
  
  for (const txn of transactions) {
    if (txn.walletId) {
      await prisma.transaction.create({
        data: {
          ...txn,
          transactionId: `txn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
      console.log(`✅ Created transaction: ${txn.type}`)
    }
  }
}

function displayDemoCredentials() {
  console.log('\n🎯 Quick Demo Credentials:')
  console.log('==========================')
  
  console.log('\n👑 Admin Account:')
  console.log('  Email: admin@qrtanki.com')
  console.log('  Password: Admin@123')
  console.log('  Role: ADMIN')
  console.log('  Features: Full system access')
  
  console.log('\n👨‍🔧 Cleaner Account:')
  console.log('  Email: cleaner@qrtanki.com')
  console.log('  Password: Cleaner@123')
  console.log('  Role: CLEANER')
  console.log('  Features: Expert cleaner with high rating')
  
  console.log('\n👤 User Accounts:')
  console.log('  Regular User:')
  console.log('    Email: user@qrtanki.com')
  console.log('    Password: User@123')
  console.log('    Features: 2 tanks, subscription, basic functionality')
  
  console.log('  Society Manager:')
  console.log('    Email: society@qrtanki.com')
  console.log('    Password: Society@123')
  console.log('    Features: 4 tanks, group booking, society management')
  
  console.log('  Emergency User:')
  console.log('    Email: emergency@qrtanki.com')
  console.log('    Password: Emergency@123')
  console.log('    Features: Emergency service testing, urgent cleaning')
  
  console.log('  Wallet User:')
  console.log('    Email: wallet@qrtanki.com')
  console.log('    Password: Wallet@123')
  console.log('    Features: Digital wallet with transactions and balance')
  
  console.log('\n📱 Demo URL: http://localhost:3000/demo')
  console.log('🌐 Live Demo: https://qrtanki-demo.vercel.app/demo')
  
  console.log('\n🎯 Test Scenarios:')
  console.log('==================')
  console.log('1. Admin Login: admin@qrtanki.com / Admin@123')
  console.log('2. Cleaner Login: cleaner@qrtanki.com / Cleaner@123')
  console.log('3. User Login: user@qrtanki.com / User@123')
  console.log('4. Society Login: society@qrtanki.com / Society@123')
  console.log('5. Emergency Login: emergency@qrtanki.com / Emergency@123')
  console.log('6. Wallet Login: wallet@qrtanki.com / Wallet@123')
  
  console.log('\n📱 Offline Testing:')
  console.log('==================')
  console.log('1. Login with any demo account')
  console.log('2. Disconnect from internet')
  console.log('3. Test offline functionality')
  console.log('4. Reconnect to internet')
  console.log('5. Verify automatic sync')
  
  console.log('\n✅ Database seeding completed!')
  console.log('🚀 QR Tanki is ready for testing with Neon database!')
}

// Export for use in other files
export { seedDatabase }

// Run if called directly
if (typeof require !== 'undefined' && require.main === module) {
  seedDatabase()
    .catch((e) => {
      console.error('❌ Error in database seeding:', e)
      process.exit(1)
    })
}