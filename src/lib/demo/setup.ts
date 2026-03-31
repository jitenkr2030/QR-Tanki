// Demo Setup Script for QR Tanki Platform
// Initializes database with demo accounts and test data

import { PrismaClient } from '@prisma/client'
import { DEMO_ACCOUNTS, QUICK_DEMO } from './credentials'

const prisma = new PrismaClient()

export async function setupDemoData() {
  console.log('🚀 Setting up QR Tanki demo data...')
  
  try {
    // Clean up existing demo data
    await cleanupDemoData()
    
    // Create demo users
    await createDemoUsers()
    
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
    
    // Create demo cleaners
    await createDemoCleaners()
    
    // Create demo earnings
    await createDemoEarnings()
    
    console.log('✅ Demo data setup completed successfully!')
    console.log('\n📱 Demo Account Credentials:')
    console.log('=====================================')
    
    // Display quick demo credentials
    Object.entries(QUICK_DEMO).forEach(([type, credentials]) => {
      console.log(`\n${type}:`)
      console.log(`  Email: ${credentials.email}`)
      console.log(`  Password: ${credentials.password}`)
    })
    
    console.log('\n🎯 Demo Scenarios:')
    console.log('==================')
    console.log('1. Complete User Journey: user@qrtanki.com / User@123')
    console.log('2. Society Group Booking: society@qrtanki.com / Society@123')
    console.log('3. Emergency Service: emergency@qrtanki.com / Emergency@123')
    console.log('4. Digital Wallet: wallet@qrtanki.com / Wallet@123')
    console.log('5. Cleaner Experience: cleaner@qrtanki.com / Cleaner@123')
    console.log('6. Admin Panel: admin@qrtanki.com / Admin@123')
    
  } catch (error) {
    console.error('❌ Error setting up demo data:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

async function cleanupDemoData() {
  console.log('🧹 Cleaning up existing demo data...')
  
  // Delete in correct order to respect foreign key constraints
  await prisma.feedback.deleteMany()
  await prisma.earning.deleteMany()
  await prisma.cleaningRecord.deleteMany()
  await prisma.cleaningRequest.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.subscription.deleteMany()
  await prisma.qrCode.deleteMany()
  await prisma.tank.deleteMany()
  await prisma.cleaner.deleteMany()
  await prisma.user.deleteMany({
    where: {
      email: {
        contains: '@qrtanki.com'
      }
    }
  })
}

async function createDemoUsers() {
  console.log('👥 Creating demo users...')
  
  // Create admin user
  const adminUser = await prisma.user.create({
    data: {
      email: DEMO_ACCOUNTS.ADMIN.email,
      name: DEMO_ACCOUNTS.ADMIN.name,
      phone: DEMO_ACCOUNTS.ADMIN.phone,
      role: 'ADMIN',
      isVerified: true
    }
  })
  
  // Create cleaner users
  for (const cleanerData of DEMO_ACCOUNTS.CLEANERS) {
    const user = await prisma.user.create({
      data: {
        email: cleanerData.email,
        name: cleanerData.name,
        phone: cleanerData.phone,
        role: 'CLEANER',
        isVerified: true
      }
    })
    
    await prisma.cleaner.create({
      data: {
        userId: user.id,
        experience: cleanerData.experience,
        serviceArea: cleanerData.serviceArea,
        rating: cleanerData.rating,
        totalJobs: cleanerData.totalJobs,
        isAvailable: cleanerData.isAvailable,
        bio: cleanerData.bio
      }
    })
  }
  
  // Create regular users
  for (const userData of DEMO_ACCOUNTS.USERS) {
    await prisma.user.create({
      data: {
        email: userData.email,
        name: userData.name,
        phone: userData.phone,
        role: 'USER',
        isVerified: true
      }
    })
  }
}

async function createDemoTanks() {
  console.log('🏗️ Creating demo tanks...')
  
  const users = await prisma.user.findMany({
    where: {
      role: 'USER'
    }
  })
  
  let tankId = 1
  for (const user of users) {
    const userData = DEMO_ACCOUNTS.USERS.find(u => u.email === user.email)
    if (userData && userData.tanks) {
      for (const tankData of userData.tanks) {
        await prisma.tank.create({
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
            isActive: true
          }
        })
        tankId++
      }
    }
  }
}

async function createDemoQRCodes() {
  console.log('📱 Creating demo QR codes...')
  
  const tanks = await prisma.tank.findMany()
  
  for (const tank of tanks) {
    const userData = DEMO_ACCOUNTS.USERS.find(u => u.tanks?.some(t => t.qrCode === tank.name))
    const tankData = userData?.tanks?.find(t => t.qrCode === tank.name)
    
    if (tankData) {
      await prisma.qrCode.create({
        data: {
          code: tankData.qrCode,
          tankId: tank.id,
          isGenerated: true,
          isPaid: true,
          generatedAt: new Date('2024-01-01'),
          paymentId: `payment-qr-${tank.id}`
        }
      })
    }
  }
}

async function createDemoSubscriptions() {
  console.log('💎 Creating demo subscriptions...')
  
  const users = await prisma.user.findMany({
    where: {
      role: 'USER'
    },
    include: {
      tanks: true
    }
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
          cleaningFrequency: sub.cleaningFrequency
        }
      })
    }
  }
}

async function createDemoCleaningRequests() {
  console.log('📅 Creating demo cleaning requests...')
  
  const users = await prisma.user.findMany({
    where: {
      role: 'USER'
    },
    include: {
      tanks: true
    }
  })
  
  for (const user of users) {
    const userData = DEMO_ACCOUNTS.USERS.find(u => u.email === user.email)
    if (userData && userData.bookings) {
      for (const booking of userData.bookings) {
        const tank = user.tanks[0] // Use first tank for demo
        
        await prisma.cleaningRequest.create({
          data: {
            userId: user.id,
            tankId: tank.id,
            cleaningType: booking.type === 'BASIC' ? 'BASIC' : 'DEEP',
            requestedDate: new Date(booking.date),
            scheduledDate: new Date(booking.date),
            preferredTime: '10:00 AM',
            status: 'COMPLETED',
            urgencyLevel: 1
          }
        })
      }
    }
  }
}

async function createDemoCleaningRecords() {
  console.log('🧹 Creating demo cleaning records...')
  
  const requests = await prisma.cleaningRequest.findMany({
    include: {
      user: true,
      tank: true
    }
  })
  
  const cleaners = await prisma.cleaner.findMany({
    include: {
      user: true
    }
  })
  
  for (const request of requests) {
    const userData = DEMO_ACCOUNTS.USERS.find(u => u.email === request.user.email)
    const booking = userData?.bookings?.find(b => b.date === request.requestedDate.toISOString().split('T')[0])
    const cleaner = cleaners[0] // Use first cleaner for demo
    
    if (booking && cleaner) {
      await prisma.cleaningRecord.create({
        data: {
          tankId: request.tankId,
          cleanerId: cleaner.id,
          requestId: request.id,
          cleaningType: request.cleaningType,
          cleanedAt: new Date(booking.date),
          duration: 90,
          beforePhotos: '["photo1.jpg", "photo2.jpg"]',
          afterPhotos: '["photo3.jpg", "photo4.jpg"]',
          notes: 'Cleaning completed successfully',
          hygieneScore: booking.type === 'BASIC' ? 4.5 : 4.2,
          isVerified: true,
          verifiedBy: 'admin'
        }
      })
    }
  }
}

async function createDemoPayments() {
  console.log('💳 Creating demo payments...')
  
  const users = await prisma.user.findMany({
    where: {
      role: 'USER'
    }
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
            transactionId: `txn-${Date.now()}-${user.id}`,
            paidAt: new Date(booking.date)
          }
        })
      }
    }
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
        isPublic: true
      }
    })
  }
}

async function createDemoCleaners() {
  // Cleaners are already created in createDemoUsers
  console.log('👨‍🔧 Demo cleaners already created')
}

async function createDemoEarnings() {
  console.log('💰 Creating demo earnings...')
  
  const cleaners = await prisma.cleaner.findMany()
  
  for (const cleaner of cleaners) {
    const cleanerData = DEMO_ACCOUNTS.CLEANERS.find(c => c.email === cleaner.user.email)
    if (cleanerData && cleanerData.earnings) {
      await prisma.earning.create({
        data: {
          cleanerId: cleaner.id,
          amount: cleanerData.earnings.thisMonth,
          commission: cleanerData.earnings.thisMonth * 0.2, // 20% commission
          netAmount: cleanerData.earnings.thisMonth * 0.8,
          earnedAt: new Date(),
          isPaid: false
        }
      })
    }
  }
}

// Function to validate demo credentials
export async function validateDemoCredentials(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email }
  })
  
  if (!user) {
    return { valid: false, error: 'User not found' }
  }
  
  // Check against demo credentials
  const allAccounts = [
    DEMO_ACCOUNTS.ADMIN,
    ...DEMO_ACCOUNTS.USERS,
    ...DEMO_ACCOUNTS.CLEANERS
  ]
  
  const demoAccount = allAccounts.find(account => account.email === email && account.password === password)
  
  if (!demoAccount) {
    return { valid: false, error: 'Invalid credentials' }
  }
  
  return { valid: true, user }
}

// Function to get demo account by type
export async function getDemoAccount(type: string) {
  switch (type) {
    case 'ADMIN':
      return await prisma.user.findUnique({
        where: { email: DEMO_ACCOUNTS.ADMIN.email }
      })
    case 'CLEANER':
      return await prisma.user.findUnique({
        where: { email: DEMO_ACCOUNTS.CLEANERS[0].email },
        include: { cleaner: true }
      })
    case 'USER':
      return await prisma.user.findUnique({
        where: { email: DEMO_ACCOUNTS.USERS[0].email },
        include: {
          tanks: true,
          subscriptions: true,
          cleaningRequests: {
            include: {
              tank: true,
              cleaningRecord: true
            }
          }
        }
      })
    default:
      return await prisma.user.findUnique({
        where: { email: DEMO_ACCOUNTS.USERS[0].email }
      })
  }
}

export default setupDemoData