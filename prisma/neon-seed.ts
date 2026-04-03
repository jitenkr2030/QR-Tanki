// Neon Database Seed Script for QR Tanki Platform
// Populates Neon PostgreSQL with comprehensive demo data

import { PrismaClient } from '@prisma/client'
import { DEMO_ACCOUNTS } from '@/lib/demo/credentials'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting Neon database seed for QR Tanki...')
  
  try {
    // Clean up existing data
    await cleanupDatabase()
    
    // Create demo accounts
    await createDemoUsers()
    
    // Create demo cleaners
    await createDemoCleaners()
    
    // Create demo tanks
    await createDemoTanks()
    
    // Create demo QR codes
    await createDemoQRCodes()
    
    // Create demo subscriptions
    await createDemoSubscriptions()
    
    // Create demo cleaning requests
    await createDemoCleaningRequests()
    
    // Create demo cleaning records
    await createDemoCleaningRecords()
    
    // Create demo payments
    await createDemoPayments()
    
    // Create demo feedback
    await createDemoFeedback()
    
    // Create demo wallets
    await createDemoWallets()
    
    // Create demo notifications
    await createDemoNotifications()
    
    console.log('✅ Neon database seeded successfully!')
    console.log('\n📱 Demo Account Credentials:')
    console.log('=====================================')
    
    // Display demo credentials
    displayDemoCredentials()
    
  } catch (error) {
    console.error('❌ Error seeding Neon database:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

async function cleanupDatabase() {
  console.log('🧹 Cleaning up Neon database...')
  
  // Delete in order to respect foreign key constraints
  const tables = [
    'reward_redemptions',
    'user_rewards',
    'rewards',
    'loyalty_programs',
    'certification_requests',
    'health_certifications',
    'insurance_claims',
    'tank_insurances',
    'escrow_transactions',
    'escrow_accounts',
    'wallet_balances',
    'transactions',
    'wallets',
    'notifications',
    'feedbacks',
    'earnings',
    'cleaning_records',
    'package_bookings',
    'custom_packages',
    'trainee_enrollments',
    'certifications',
    'training_programs',
    'emergency_requests',
    'group_members',
    'group_bookings',
    'payments',
    'subscriptions',
    'qr_codes',
    'cleaning_requests',
    'tanks',
    'cleaners',
    'users'
  ]
  
  for (const table of tables) {
    try {
      await prisma.$executeRawUnsafe(`DELETE FROM "${table} CASCADE;`)
      console.log(`✅ Cleared table: ${table}`)
    } catch (error) {
      console.log(`⚠️ Warning: Could not clear table ${table}:`, error.message)
    }
  }
}

async function createDemoUsers() {
  console.log('👥 Creating demo users in Neon...')
  
  // Create admin user
  const adminUser = await prisma.user.create({
    data: {
      email: DEMO_ACCOUNTS.ADMIN.email,
      name: DEMO_ACCOUNTS.ADMIN.name,
      phone: DEMO_ACCOUNTS.ADMIN.phone,
      role: 'ADMIN',
      isVerified: true,
    }
  })
  console.log(`✅ Created admin user: ${adminUser.email}`)
  
  // Create regular users
  for (const userData of DEMO_ACCOUNTS.USERS) {
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        name: userData.name,
        phone: userData.phone,
        role: 'USER',
        isVerified: true,
      }
    })
    console.log(`✅ Created user: ${user.email}`)
  }
}

async function createDemoCleaners() {
  console.log('🔧 Creating demo cleaners in Neon...')
  
  for (const cleanerData of DEMO_ACCOUNTS.CLEANERS) {
    // First create the user
    const user = await prisma.user.create({
      data: {
        email: cleanerData.email,
        name: cleanerData.name,
        phone: cleanerData.phone,
        role: 'CLEANER',
        isVerified: true,
      }
    })
    
    // Then create the cleaner profile
    const cleaner = await prisma.cleaner.create({
      data: {
        userId: user.id,
        experience: cleanerData.experience,
        serviceArea: cleanerData.serviceArea,
        rating: cleanerData.rating,
        totalJobs: cleanerData.totalJobs,
        isAvailable: cleanerData.isAvailable,
        bio: cleanerData.bio,
      }
    })
    console.log(`✅ Created cleaner: ${user.email}`)
  }
}

async function createDemoTanks() {
  console.log('🏗️ Creating demo tanks in Neon...')
  
  const users = await prisma.user.findMany({
    where: {
      role: 'USER',
    },
  })
  
  for (const user of users) {
    const userData = DEMO_ACCOUNTS.USERS.find(u => u.email === user.email)
    if (userData && userData.tanks) {
      for (const tankData of userData.tanks) {
        const tank = await prisma.tank.create({
          data: {
            userId: user.id,
            name: tankData.name,
            type: tankData.type,
            capacity: tankData.capacity,
            location: tankData.location,
            installationDate: new Date('2023-01-01'),
            lastCleanedDate: tankData.lastCleanedDate ? new Date(tankData.lastCleanedDate) : null,
            nextDueDate: tankData.nextDueDate ? new Date(tankData.nextDueDate) : null,
            hygieneScore: tankData.hygieneScore,
            isActive: true,
          }
        })
        console.log(`✅ Created tank: ${tank.name}`)
      }
    }
  }
}

async function createDemoQRCodes() {
  console.log('📱 Creating demo QR codes in Neon...')
  
  const tanks = await prisma.tank.findMany()
  
  for (const tank of tanks) {
    const userData = DEMO_ACCOUNTS.USERS.find(u => u.tanks?.some(t => t.name === tank.name))
    const tankData = userData?.tanks?.find(t => t.name === tank.name)
    
    if (tankData) {
      await prisma.qrCode.create({
        data: {
          code: tankData.qrCode.code,
          tankId: tank.id,
          isGenerated: true,
          isPaid: tankData.qrCode.isPaid,
          generatedAt: new Date('2024-01-01'),
        }
      })
      console.log(`✅ Created QR code: ${tankData.qrCode.code}`)
    }
  }
}

async function createDemoSubscriptions() {
  console.log('💎 Creating demo subscriptions in Neon...')
  
  const users = await prisma.user.findMany({
    where: {
      role: 'USER',
    },
  })
  
  for (const user of users) {
    const userData = DEMO_ACCOUNTS.USERS.find(u => u.email === user.email)
    if (userData && userData.subscription) {
      const sub = userData.subscription
      
      await prisma.subscription.create({
        data: {
          userId: user.id,
          plan: sub.plan === 'PREMIUM' ? 'PREMIUM' : 'BASIC',
          amount: sub.plan === 'PREMIUM' ? 599 : 399,
          startDate: new Date(sub.startDate),
          endDate: new Date(sub.endDate),
          isActive: sub.status === 'ACTIVE',
          autoRenew: false,
          cleaningFrequency: sub.cleaningFrequency,
        }
      })
      console.log(`✅ Created subscription for: ${user.email}`)
    }
  }
}

async function createDemoCleaningRequests() {
  console.log('📅 Creating demo cleaning requests in Neon...')
  
  const users = await prisma.user.findMany({
    where: {
      role: 'USER',
    },
    include: {
      tanks: true,
    },
  })
  
  const cleaners = await prisma.cleaner.findMany({
    include: {
      user: true,
    },
  })
  
  for (const user of users) {
    const userData = DEMO_ACCOUNTS.USERS.find(u => u.email === user.email)
    if (userData && userData.bookings) {
      for (const booking of userData.bookings) {
        const tank = user.tanks[0] // Use first tank for demo
        const cleaner = cleaners[0] // Use first cleaner for demo
        
        await prisma.cleaningRequest.create({
          data: {
            userId: user.id,
            tankId: tank.id,
            cleanerId: cleaner.id,
            cleaningType: booking.type === 'BASIC' ? 'BASIC' : 'DEEP',
            requestedDate: new Date(booking.date),
            scheduledDate: new Date(booking.date),
            preferredTime: '10:00 AM',
            status: 'COMPLETED',
            urgencyLevel: 1,
          }
        })
        console.log(`✅ Created cleaning request for: ${user.email}`)
      }
    }
  }
}

async function createDemoCleaningRecords() {
  console.log('🧹 Creating demo cleaning records in Neon...')
  
  const requests = await prisma.cleaningRequest.findMany({
    include: {
      user: true,
      tank: true,
      cleaner: {
        include: {
          user: true,
        },
      },
    },
  })
  
  for (const request of requests) {
    const userData = DEMO_ACCOUNTS.USERS.find(u => u.email === request.user.email)
    const booking = userData?.bookings?.find(b => b.date === request.requestedDate.toISOString().split('T')[0])
    const cleaner = request.cleaner
    
    if (booking && cleaner) {
      await prisma.cleaningRecord.create({
        data: {
          tankId: request.tankId,
          cleanerId: request.cleanerId,
          requestId: request.id,
          cleaningType: request.cleaningType,
          cleanedAt: new Date(booking.date),
          duration: 90,
          beforePhotos: '["photo1.jpg", "photo2.jpg"]',
          afterPhotos: '["photo3.jpg", "photo4.jpg"]',
          notes: 'Cleaning completed successfully',
          hygieneScore: booking.type === 'BASIC' ? 4.5 : 4.2,
          isVerified: true,
          verifiedBy: 'admin',
        }
      })
      console.log(`✅ Created cleaning record for: ${request.user.email}`)
    }
  }
}

async function createDemoPayments() {
  console.log('💳 Creating demo payments in Neon...')
  
  const users = await prisma.user.findMany({
    where: {
      role: 'USER',
    },
  })
  
  for (const user of users) {
    const userData = DEMO_ACCOUNTS.USERS.find(u => u.email === user.email)
    if (userData && userData.bookings) {
      for (const booking of userData.bookings) {
        await prisma.payment.create({
          data: {
            userId: user.id,
            amount: booking.cost,
            type: 'CLEANING',
            status: 'COMPLETED',
            paymentMethod: 'UPI',
            transactionId: `txn-${user.id}-${Date.now()}`,
            paidAt: new Date(booking.date),
          }
        })
        console.log(`✅ Created payment for: ${user.email}`)
      }
    }
  }
}

async function createDemoFeedback() {
  console.log('⭐ Creating demo feedback in Neon...')
  
  const records = await prisma.cleaningRecord.findMany({
    include: {
      user: true,
      cleaner: {
        include: {
          user: true,
        },
      },
    },
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
      }
    })
    console.log(`✅ Created feedback for: ${record.user.email}`)
  }
}

async function createDemoWallets() {
  console.log('💰 Creating demo wallets in Neon...')
  
  const users = await prisma.user.findMany({
    where: {
      role: 'USER',
    },
  })
  
  for (const user of users) {
    const userData = DEMO_ACCOUNTS.USERS.find(u => u.email === user.email)
    if (userData && userData.wallet) {
      const wallet = await prisma.wallet.create({
        data: {
          userId: user.id,
          balance: userData.wallet.balance,
          currency: 'INR',
          isActive: true,
        }
      })
      
      // Create initial transaction
      await prisma.transaction.create({
        data: {
          walletId: wallet.id,
          type: 'CREDIT',
          amount: userData.wallet.balance,
          description: 'Initial wallet balance',
          status: 'COMPLETED',
        }
      })
      
      console.log(`✅ Created wallet for: ${user.email}`)
    }
  }
}

async function createDemoNotifications() {
  console.log('🔔 Creating demo notifications in Neon...')
  
  const users = await prisma.user.findMany()
  
  for (const user of users) {
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: 'Welcome to QR Tanki!',
        message: 'Your account has been successfully created. Start managing your water tanks today!',
        type: 'SYSTEM',
        isRead: false,
      }
    })
    console.log(`✅ Created notification for: ${user.email}`)
  }
}

function displayDemoCredentials() {
  console.log('\n🎯 Quick Demo Credentials:')
  console.log('==========================')
  
  console.log('\n👑 Admin Account:')
  console.log('  Email: admin@qrtanki.com')
  console.log('  Password: Admin@123')
  console.log('  Role: ADMIN')
  
  console.log('\n👨‍🔧 Cleaner Accounts:')
  DEMO_ACCOUNTS.CLEANERS.forEach(cleaner => {
    console.log(`  ${cleaner.name}:`)
    console.log(`    Email: ${cleaner.email}`)
    console.log(`    Password: Cleaner@123`)
    console.log(`    Role: CLEANER`)
  })
  
  console.log('\n👤 User Accounts:')
  DEMO_ACCOUNTS.USERS.forEach(user => {
    console.log(`  ${user.name}:`)
    console.log(`    Email: ${user.email}`)
    console.log(`    Password: User@123`)
    console.log(`    Role: USER`)
    console.log(`    Features: ${user.description}`)
  })
  
  console.log('\n📱 Demo URL: http://localhost:3000/demo')
  console.log('🌐 Live Demo: https://qrtanki-demo.vercel.app/demo')
  
  console.log('\n🎯 Test Scenarios:')
  console.log('==================')
  console.log('1. Complete User Journey: user@qrtanki.com / User@123')
  console.log('2. Society Group Booking: society@qrtanki.com / Society@123')
  console.log('3. Emergency Service: emergency@qrtanki.com / Emergency@123')
  console.log('4. Digital Wallet: wallet@qrtanki.com / Wallet@123')
  console.log('5. Cleaner Experience: cleaner@qrtanki.com / Cleaner@123')
  console.log('6. Admin Panel: admin@qrtanki.com / Admin@123')
  
  console.log('\n📱 Offline Testing:')
  console.log('==================')
  console.log('1. Login with any demo account')
  console.log('2. Disconnect from internet')
  console.log('3. Test offline functionality')
  console.log('4. Reconnect to internet')
  console.log('5. Verify automatic sync')
  
  console.log('\n✅ Neon database seeding completed!')
  console.log('🚀 QR Tanki is ready for testing with Neon PostgreSQL!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding Neon database:', e)
    process.exit(1)
  })