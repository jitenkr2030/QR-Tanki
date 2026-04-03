// Mobile-Friendly Database Seeding Page
// Page: /seed-database

import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

// Safe PrismaClient initialization
function getPrismaClient() {
  const databaseUrl = process.env.DATABASE_URL
  
  if (!databaseUrl) {
    console.warn('DATABASE_URL is not configured')
    return null
  }
  
  return new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl
      }
    }
  })
}

export async function POST(request: NextRequest) {
  try {
    const prisma = getPrismaClient()
    
    if (!prisma) {
      return NextResponse.json({ 
        success: false,
        error: 'DATABASE_URL not configured',
        message: 'Please contact administrator to configure database',
        instructions: {
          step1: 'Contact your development team',
          step2: 'Ask them to configure DATABASE_URL in Vercel dashboard',
          step3: 'Redeploy the application'
        }
      }, { status: 500 })
    }
    
    console.log('🌱 Starting Mobile Database Seeding...')
    
    // Test connection
    await prisma.$queryRaw`SELECT 1`
    
    // Check if data already exists
    const userCount = await prisma.user.count()
    
    if (userCount > 0) {
      const tableCounts = await getTableCounts(prisma)
      return NextResponse.json({ 
        success: true,
        message: 'Database already contains data',
        userCount,
        tables: tableCounts,
        status: 'completed'
      })
    }
    
    // Run seeding
    await seedBasicData(prisma)
    
    const tableCounts = await getTableCounts(prisma)
    
    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully!',
      tables: tableCounts,
      demoAccounts: {
        admin: 'admin@qrtanki.com / Admin@123',
        cleaner: 'cleaner@qrtanki.com / Cleaner@123',
        user: 'user@qrtanki.com / User@123',
        society: 'society@qrtanki.com / Society@123',
        emergency: 'emergency@qrtanki.com / Emergency@123',
        wallet: 'wallet@qrtanki.com / Wallet@123'
      },
      status: 'completed'
    })
    
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to seed database', 
        details: error.message,
        status: 'error'
      },
      { status: 500 }
    )
  } finally {
    const prisma = getPrismaClient()
    if (prisma) {
      await prisma.$disconnect()
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    const prisma = getPrismaClient()
    
    if (!prisma) {
      return NextResponse.json({
        success: false,
        message: 'DATABASE_URL not configured',
        status: 'error',
        databaseConfigured: false,
        instructions: {
          step1: 'Contact your development team',
          step2: 'Ask them to configure DATABASE_URL in Vercel dashboard',
          step3: 'Redeploy the application'
        }
      })
    }
    
    const tableCounts = await getTableCounts(prisma)
    const isEmpty = tableCounts.users === 0
    
    return NextResponse.json({
      success: true,
      message: isEmpty ? 'Database is empty - ready for seeding' : 'Database contains data',
      tables: tableCounts,
      isEmpty,
      databaseConfigured: true,
      status: 'checked'
    })
    
  } catch (error) {
    console.error('❌ Error checking database:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to check database', 
        details: error.message,
        status: 'error'
      },
      { status: 500 }
    )
  } finally {
    const prisma = getPrismaClient()
    if (prisma) {
      await prisma.$disconnect()
    }
  }
}

async function getTableCounts(prisma: PrismaClient) {
  return {
    users: await prisma.user.count(),
    cleaners: await prisma.cleaner.count(),
    tanks: await prisma.tank.count(),
    qrCodes: await prisma.qrCode.count(),
    cleaningRequests: await prisma.cleaningRequest.count(),
    cleaningRecords: await prisma.cleaningRecord.count(),
    payments: await prisma.payment.count(),
    subscriptions: await prisma.subscription.count(),
    feedback: await prisma.feedback.count(),
    earnings: await prisma.earning.count(),
    wallets: await prisma.wallet.count(),
    transactions: await prisma.transaction.count()
  }
}

async function seedBasicData(prisma: PrismaClient) {
  // Create demo users
  const demoUsers = [
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
  
  for (const userData of demoUsers) {
    await prisma.user.create({ data: userData })
  }
  
  // Create cleaner
  const adminUser = await prisma.user.findUnique({
    where: { email: 'admin@qrtanki.com' }
  })
  
  if (adminUser) {
    await prisma.cleaner.create({
      data: {
        userId: adminUser.id,
        experience: '5 years',
        serviceArea: 'Bangalore Urban',
        rating: 4.8,
        totalJobs: 150,
        isAvailable: true,
        bio: 'Professional water tank cleaning expert.'
      }
    })
  }
  
  // Create basic tanks
  const regularUser = await prisma.user.findUnique({
    where: { email: 'user@qrtanki.com' }
  })
  
  if (regularUser) {
    await prisma.tank.create({
      data: {
        userId: regularUser.id,
        name: 'Demo Tank',
        type: 'OVERHEAD',
        capacity: '1000 Liters',
        location: 'Demo Location',
        hygieneScore: 4.5,
        isActive: true
      }
    })
    
    const tank = await prisma.tank.findFirst({ where: { userId: regularUser.id } })
    if (tank) {
      await prisma.qrCode.create({
        data: {
          code: 'QT-DEMO-001',
          tankId: tank.id,
          isGenerated: true,
          isPaid: true
        }
      })
    }
  }
}