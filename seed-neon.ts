// Neon Database Seeding Script
// Run this to populate your Neon database with demo data

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})

async function seedNeonDatabase() {
  console.log('🌱 Starting Neon Database Seeding...')
  console.log('=====================================')
  
  try {
    // Test connection first
    await prisma.$queryRaw`SELECT 1`
    console.log('✅ Database connection successful')
    
    // Clean up existing data
    console.log('\n🧹 Cleaning up existing data...')
    await cleanupDatabase()
    
    // Create demo data
    console.log('\n👥 Creating demo users...')
    await createDemoUsers()
    
    console.log('\n👨‍🔧 Creating demo cleaners...')
    await createDemoCleaners()
    
    console.log('\n🏗️ Creating demo tanks...')
    await createDemoTanks()
    
    console.log('\n📱 Creating demo QR codes...')
    await createDemoQRCodes()
    
    console.log('\n💎 Creating demo subscriptions...')
    await createDemoSubscriptions()
    
    console.log('\n📅 Creating demo cleaning requests...')
    await createDemoCleaningRequests()
    
    console.log('\n🧹 Creating demo cleaning records...')
    await createDemoCleaningRecords()
    
    console.log('\n💳 Creating demo payments...')
    await createDemoPayments()
    
    console.log('\n⭐ Creating demo feedback...')
    await createDemoFeedback()
    
    console.log('\n💰 Creating demo earnings...')
    await createDemoEarnings()
    
    console.log('\n💼 Creating demo wallets...')
    await createDemoWallets()
    
    console.log('\n💸 Creating demo transactions...')
    await createDemoTransactions()
    
    console.log('\n✅ Neon Database Seeding Complete!')
    console.log('=====================================')
    
    // Display summary
    await displaySeedingSummary()
    
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

async function cleanupDatabase() {
  const tables = [
    'feedback', 'earning', 'transaction', 'wallet_balance',
    'cleaning_record', 'cleaning_request', 'payment', 'subscription',
    'qr_code', 'tank', 'cleaner', 'user'
  ]
  
  for (const table of tables) {
    try {
      await prisma.$executeRawUnsafe(`DELETE FROM "${table}"`)
      console.log(`   ✅ Cleaned ${table}`)
    } catch (error) {
      console.log(`   ⚠️ Could not clean ${table}: ${error.message}`)
    }
  }
}

async function createDemoUsers() {
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
    console.log(`   ✅ Created user: ${user.email}`)
  }
}

async function createDemoCleaners() {
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
        bio: 'Professional water tank cleaning expert with 5+ years of experience.',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
    console.log(`   ✅ Created cleaner: ${cleanerUser.email}`)
  }
}

async function createDemoTanks() {
  const users = await prisma.user.findMany({
    where: { role: 'USER' }
  })
  
  const tankData = [
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
      console.log(`   ✅ Created tank: ${createdTank.name}`)
    }
  }
}

async function createDemoQRCodes() {
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
    console.log(`   ✅ Created QR code for: ${tank.name}`)
  }
}

async function createDemoSubscriptions() {
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
      console.log(`   ✅ Created subscription for user: ${sub.userId}`)
    }
  }
}

async function createDemoCleaningRequests() {
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
      userId: users.find(u => u.email === 'society@qrtanki.com')?.id,
      tankId: tanks.find(t => t.name === 'Block A Tank')?.id,
      cleaningType: 'DEEP',
      requestedDate: new Date('2024-01-10'),
      scheduledDate: new Date('2024-01-10'),
      preferredTime: '9:00 AM',
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
      console.log(`   ✅ Created cleaning request: ${request.cleaningType}`)
    }
  }
}

async function createDemoCleaningRecords() {
  const requests = await prisma.cleaningRequest.findMany()
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
      console.log(`   ✅ Created cleaning record for request: ${request.id}`)
    }
  }
}

async function createDemoPayments() {
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
    console.log(`   ✅ Created payment for: ${request.cleaningType}`)
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
    console.log(`   ✅ Created subscription payment`)
  }
}

async function createDemoFeedback() {
  const records = await prisma.cleaningRecord.findMany({
    include: {
      tank: {
        include: {
          user: true
        }
      },
      cleaner: {
        include: {
          user: true
        }
      },
      request: {
        include: {
          user: true
        }
      }
    }
  })
  
  for (const record of records) {
    const user = record.tank?.user || record.request?.user
    if (user) {
      await prisma.feedback.create({
        data: {
          userId: user.id,
          cleaningRecordId: record.id,
          cleanerId: record.cleanerId,
          rating: 5,
          comment: 'Excellent service! Very professional and thorough cleaning.',
          isPublic: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
      console.log(`   ✅ Created feedback for: ${record.id}`)
    }
  }
}

async function createDemoEarnings() {
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
    console.log(`   ✅ Created earnings for cleaner: ${cleaner.id}`)
  }
}

async function createDemoWallets() {
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
    
    console.log(`   ✅ Created wallet for: ${user.email}`)
  }
}

async function createDemoTransactions() {
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
      console.log(`   ✅ Created transaction: ${txn.type}`)
    }
  }
}

async function displaySeedingSummary() {
  console.log('\n📊 Seeding Summary:')
  console.log('==================')
  
  const counts = await Promise.all([
    prisma.user.count(),
    prisma.cleaner.count(),
    prisma.tank.count(),
    prisma.qrCode.count(),
    prisma.cleaningRequest.count(),
    prisma.cleaningRecord.count(),
    prisma.payment.count(),
    prisma.subscription.count(),
    prisma.feedback.count(),
    prisma.earning.count(),
    prisma.wallet.count(),
    prisma.transaction.count()
  ])
  
  console.log(`👥 Users: ${counts[0]}`)
  console.log(`👨‍🔧 Cleaners: ${counts[1]}`)
  console.log(`🏗️ Tanks: ${counts[2]}`)
  console.log(`📱 QR Codes: ${counts[3]}`)
  console.log(`📅 Cleaning Requests: ${counts[4]}`)
  console.log(`🧹 Cleaning Records: ${counts[5]}`)
  console.log(`💳 Payments: ${counts[6]}`)
  console.log(`💎 Subscriptions: ${counts[7]}`)
  console.log(`⭐ Feedback: ${counts[8]}`)
  console.log(`💰 Earnings: ${counts[9]}`)
  console.log(`💼 Wallets: ${counts[10]}`)
  console.log(`💸 Transactions: ${counts[11]}`)
  
  console.log('\n🎯 Demo Account Credentials:')
  console.log('==================')
  console.log('👑 Admin: admin@qrtanki.com / Admin@123')
  console.log('👨‍🔧 Cleaner: cleaner@qrtanki.com / Cleaner@123')
  console.log('👤 User: user@qrtanki.com / User@123')
  console.log('🏢 Society: society@qrtanki.com / Society@123')
  console.log('🚨 Emergency: emergency@qrtanki.com / Emergency@123')
  console.log('💼 Wallet: wallet@qrtanki.com / Wallet@123')
  
  console.log('\n🚀 Your Neon database is now populated with demo data!')
}

// Run the seeding
seedNeonDatabase()
  .catch((e) => {
    console.error('❌ Error seeding Neon database:', e)
    process.exit(1)
  })