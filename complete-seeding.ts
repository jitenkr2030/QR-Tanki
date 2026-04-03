// Complete Neon Database Seeding Script
// This script completes the remaining data that wasn't seeded

import { PrismaClient } from '@prisma/client'

// Force the Neon database URL
const NEON_DATABASE_URL = "postgresql://neondb_owner:npg_eUhLkNPJc27D@ep-soft-frog-a7c0vavv-pooler.ap-southeast-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: NEON_DATABASE_URL
    }
  }
})

async function completeSeeding() {
  console.log('🌱 Completing Neon Database Seeding...')
  console.log('=====================================')
  
  try {
    // Test connection first
    await prisma.$queryRaw`SELECT 1`
    console.log('✅ Database connection successful')
    
    // Check current state
    console.log('\n📊 Checking Current Database State...')
    const currentCounts = await getTableCounts()
    console.log('Current data:', currentCounts)
    
    // Create missing feedback
    if (currentCounts.feedbacks === 0) {
      console.log('\n⭐ Creating missing feedback...')
      await createDemoFeedback()
    }
    
    // Create missing earnings
    if (currentCounts.earnings === 0) {
      console.log('\n💰 Creating missing earnings...')
      await createDemoEarnings()
    }
    
    // Create missing wallets
    if (currentCounts.wallets === 0) {
      console.log('\n💼 Creating missing wallets...')
      await createDemoWallets()
    }
    
    // Create missing transactions
    if (currentCounts.transactions === 0) {
      console.log('\n💸 Creating missing transactions...')
      await createDemoTransactions()
    }
    
    // Final verification
    console.log('\n📊 Final Database State...')
    const finalCounts = await getTableCounts()
    console.log('Final data:', finalCounts)
    
    console.log('\n✅ Neon Database Seeding Complete!')
    console.log('=====================================')
    
    // Display summary
    displaySeedingSummary(finalCounts)
    
  } catch (error) {
    console.error('❌ Error completing database seeding:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

async function getTableCounts() {
  return {
    users: await prisma.user.count(),
    cleaners: await prisma.cleaner.count(),
    tanks: await prisma.tank.count(),
    qrCodes: await prisma.qrCode.count(),
    cleaningRequests: await prisma.cleaningRequest.count(),
    cleaningRecords: await prisma.cleaningRecord.count(),
    payments: await prisma.payment.count(),
    subscriptions: await prisma.subscription.count(),
    feedbacks: await prisma.feedback.count(),
    earnings: await prisma.earning.count(),
    wallets: await prisma.wallet.count(),
    transactions: await prisma.transaction.count()
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

function displaySeedingSummary(counts) {
  console.log('\n📊 Final Seeding Summary:')
  console.log('==========================')
  
  console.log(`👥 Users: ${counts.users}`)
  console.log(`👨‍🔧 Cleaners: ${counts.cleaners}`)
  console.log(`🏗️ Tanks: ${counts.tanks}`)
  console.log(`📱 QR Codes: ${counts.qrCodes}`)
  console.log(`📅 Cleaning Requests: ${counts.cleaningRequests}`)
  console.log(`🧹 Cleaning Records: ${counts.cleaningRecords}`)
  console.log(`💳 Payments: ${counts.payments}`)
  console.log(`💎 Subscriptions: ${counts.subscriptions}`)
  console.log(`⭐ Feedback: ${counts.feedbacks}`)
  console.log(`💰 Earnings: ${counts.earnings}`)
  console.log(`💼 Wallets: ${counts.wallets}`)
  console.log(`💸 Transactions: ${counts.transactions}`)
  
  console.log('\n🎯 Demo Account Credentials:')
  console.log('==================')
  console.log('👑 Admin: admin@qrtanki.com / Admin@123')
  console.log('👨‍🔧 Cleaner: cleaner@qrtanki.com / Cleaner@123')
  console.log('👤 User: user@qrtanki.com / User@123')
  console.log('🏢 Society: society@qrtanki.com / Society@123')
  console.log('🚨 Emergency: emergency@qrtanki.com / Emergency@123')
  console.log('💼 Wallet: wallet@qrtanki.com / Wallet@123')
  
  console.log('\n🚀 Your Neon database is now fully populated with demo data!')
}

// Run the seeding
completeSeeding()
  .catch((e) => {
    console.error('❌ Error completing database seeding:', e)
    process.exit(1)
  })