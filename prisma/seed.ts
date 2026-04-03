// Database Seed Script for QR Tanki Platform
// Populates database with demo accounts and test data

import { PrismaClient } from '@prisma/client'
import { DEMO_ACCOUNTS } from '@/lib/demo/credentials'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')
  
  try {
    // Clean up existing data
    await cleanupDatabase()
    
    // Create demo accounts
    await createDemoAccounts()
    
    // Create demo data
    await createDemoData()
    
    console.log('✅ Database seeded successfully!')
    console.log('\n📱 Demo Accounts Created:')
    console.log('============================')
    
    // Display all demo accounts
    await displayDemoAccounts()
    
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

async function cleanupDatabase() {
  console.log('🧹 Cleaning up database...')
  
  // Delete in order to respect foreign key constraints
  await prisma.feedback.deleteMany()
  await prisma.earning.deleteMany()
  await prisma.cleaningRecord.deleteMany()
  await prisma.cleaningRequest.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.subscription.deleteMany()
  await prisma.qrCode.deleteMany()
  await prisma.tank.deleteMany()
  await prisma.cleaner.deleteMany()
  await prisma.user.deleteMany()
}

async function createDemoAccounts() {
  console.log('👥 Creating demo accounts...')
  
  // Create admin user
  const adminUser = await prisma.user.create({
    data: {
      email: DEMO_ACCOUNTS.ADMIN.email,
      name: DEMO_ACCOUNTS.ADMIN.name,
      phone: DEMO_ACCOUNTS.ADMIN.phone,
      role: 'ADMIN',
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })
  console.log(`✅ Created admin user: ${adminUser.email}`)
  
  // Create cleaner users
  for (const cleanerData of DEMO_ACCOUNTS.CLEANERS) {
    const user = await prisma.user.create({
      data: {
        email: cleanerData.email,
        name: cleanerData.name,
        phone: cleanerData.phone,
        role: 'CLEANER',
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
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
        bio: cleanerData.bio,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
    console.log(`✅ Created cleaner user: ${user.email}`)
  }
  
  // Create regular users
  for (const userData of DEMO_ACCOUNTS.USERS) {
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        name: userData.name,
        phone: userData.phone,
        role: 'USER',
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
    console.log(`✅ Created user: ${user.email}`)
  }
}

async function createDemoData() {
  console.log('📊 Creating demo data...')
  
  const users = await prisma.user.findMany({
    where: {
      role: 'USER'
    }
  })
  
  const cleaners = await prisma.cleaner.findMany({
    include: {
      user: true
    }
  })
  
  // Create tanks and related data for each user
  for (const user of users) {
    const userData = DEMO_ACCOUNTS.USERS.find(u => u.email === user.email)
    if (userData && userData.tanks) {
      // Create tanks
      for (const tankData of userData.tanks) {
        const tank = await prisma.tank.create({
          data: {
            userId: user.id,
            name: tankData.name,
            type: tankData.type as any,
            capacity: tankData.capacity,
            location: tankData.location,
            installationDate: new Date('2023-01-01'),
            lastCleanedDate: tankData.lastCleanedDate ? new Date(tankData.lastCleanedDate) : null,
            nextDueDate: tankData.nextDueDate ? new Date(tankData.nextDueDate) : null,
            hygieneScore: tankData.hygieneScore,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        })
        
        // Create QR code
        await prisma.qrCode.create({
          data: {
            code: tankData.qrCode,
            tankId: tank.id,
            isGenerated: true,
            isPaid: true,
            generatedAt: new Date('2024-01-01'),
            createdAt: new Date(),
            updatedAt: new Date()
          }
        })
        
        // Create cleaning request and record
        const cleaningRequest = await prisma.cleaningRequest.create({
          data: {
            userId: user.id,
            tankId: tank.id,
            cleaningType: 'BASIC',
            requestedDate: new Date('2024-01-15'),
            scheduledDate: new Date('2024-01-15'),
            preferredTime: '10:00 AM',
            status: 'COMPLETED',
            urgencyLevel: 1,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        })
        
        await prisma.cleaningRecord.create({
          data: {
            tankId: tank.id,
            cleanerId: cleaners[0].id,
            requestId: cleaningRequest.id,
            cleaningType: 'BASIC',
            cleanedAt: new Date('2024-01-15'),
            duration: 90,
            beforePhotos: '["photo1.jpg", "photo2.jpg"]',
            afterPhotos: '["photo3.jpg", "photo4.jpg"]',
            notes: 'Cleaning completed successfully',
            hygieneScore: 4.5,
            isVerified: true,
            verifiedBy: 'admin',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        })
        
        // Create payment
        await prisma.payment.create({
          data: {
            userId: user.id,
            amount: 699,
            type: 'CLEANING',
            status: 'COMPLETED',
            paymentMethod: 'UPI',
            transactionId: `txn-${user.id}-${tank.id}`,
            paidAt: new Date('2024-01-15'),
            createdAt: new Date(),
            updatedAt: new Date()
          }
        })
        
        // Create feedback
        await prisma.feedback.create({
          data: {
            userId: user.id,
            cleaningRecordId: cleaningRequest.id,
            cleanerId: cleaners[0].id,
            rating: 5,
            comment: 'Excellent service! Very professional and thorough cleaning.',
            isPublic: true,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        })
      }
      
      // Create subscription if user has one
      if (userData.subscription) {
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
            createdAt: new Date(),
            updatedAt: new Date()
          }
        })
      }
    }
  }
  
  // Create earnings for cleaners
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
          isPaid: false,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
    }
  }
}

async function displayDemoAccounts() {
  console.log('\n🎯 Quick Demo Credentials:')
  console.log('==========================')
  
  const { QUICK_DEMO } = await import('@/lib/demo/credentials')
  
  Object.entries(QUICK_DEMO).forEach(([type, credentials]) => {
    console.log(`\n${type}:`)
    console.log(`  Email: ${credentials.email}`)
    console.log(`  Password: ${credentials.password}`)
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
  
  console.log('\n✅ Database seeding completed successfully!')
  console.log('🚀 QR Tanki is ready for testing!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })