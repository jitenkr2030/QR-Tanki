// Database Connection Test Script
// Run this to verify Neon database connection and check data

import { PrismaClient } from '@prisma/client'

// Load environment variables
import { config } from 'dotenv'

// Load environment variables from .env.local (priority) then .env
config({ path: '.env.local' })
config({ path: '.env' })

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})

async function testDatabaseConnection() {
  console.log('🔗 Testing Neon Database Connection...')
  console.log('=====================================')
  console.log('DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 50) + '...')
  
  try {
    // Test basic connection
    await prisma.$queryRaw`SELECT 1`
    console.log('✅ Database connection successful')
    
    // Check if tables exist
    console.log('\n📊 Checking Database Tables...')
    
    const tables = [
      { name: 'users', model: 'user' },
      { name: 'cleaners', model: 'cleaner' },
      { name: 'tanks', model: 'tank' },
      { name: 'qr_codes', model: 'qrCode' },
      { name: 'cleaning_requests', model: 'cleaningRequest' },
      { name: 'cleaning_records', model: 'cleaningRecord' },
      { name: 'payments', model: 'payment' },
      { name: 'subscriptions', model: 'subscription' },
      { name: 'feedbacks', model: 'feedback' },
      { name: 'earnings', model: 'earning' },
      { name: 'wallets', model: 'wallet' },
      { name: 'transactions', model: 'transaction' }
    ]
    
    for (const table of tables) {
      try {
        const count = await prisma[table.model].count()
        console.log(`📋 ${table.name}: ${count} records`)
        
        if (count > 0 && table.model === 'user') {
          const users = await prisma[table.model].findMany({
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
              createdAt: true
            },
            take: 5
          })
          console.log('👤 Sample Users:')
          users.forEach(user => {
            console.log(`   - ${user.email} (${user.role})`)
          })
        }
      } catch (error) {
        console.log(`❌ ${table.name}: Error - ${error.message}`)
      }
    }
    
    console.log('\n🎯 Database Connection Test Complete')
    
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    console.log('\n🔧 Troubleshooting:')
    console.log('1. Check DATABASE_URL in .env file')
    console.log('2. Verify Neon database is active')
    console.log('3. Ensure schema is pushed to Neon')
    console.log('4. Check if database seeding was executed')
    console.log('\n📊 Current DATABASE_URL:', process.env.DATABASE_URL)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the test
testDatabaseConnection()