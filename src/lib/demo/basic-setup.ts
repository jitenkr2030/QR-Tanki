// Simplified Demo Setup for QR Tanki Platform
// Creates basic demo accounts without complex schema dependencies

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function setupBasicDemo() {
  console.log('🚀 Setting up basic QR Tanki demo...')
  
  try {
    // Clean up existing demo data
    await cleanupBasicDemo()
    
    // Create basic demo users
    await createBasicDemoUsers()
    
    // Create basic demo tanks
    await createBasicDemoTanks()
    
    // Create basic demo QR codes
    await createBasicDemoQRCodes()
    
    console.log('✅ Basic demo setup completed successfully!')
    console.log('\n📱 Basic Demo Credentials:')
    console.log('==================================')
    
    // Display basic demo credentials
    displayBasicDemoCredentials()
    
  } catch (error) {
    console.error('❌ Error setting up basic demo:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

async function cleanupBasicDemo() {
  console.log('🧹 Cleaning up basic demo data...')
  
  // Delete in correct order to respect foreign key constraints
  await prisma.qrCode.deleteMany({
    where: {
      code: {
        startsWith: 'QT-DEMO-'
      }
    }
  })
  
  await prisma.tank.deleteMany({
    where: {
      name: {
        contains: 'Demo Tank'
      }
    }
  })
  
  await prisma.user.deleteMany({
    where: {
      email: {
        contains: '@qrtanki.com'
      }
    }
  })
}

async function createBasicDemoUsers() {
  console.log('👥 Creating basic demo users...')
  
  // Create admin user
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@qrtanki.com',
      name: 'Admin User',
      phone: '+91 98765 43210',
      role: 'ADMIN',
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })
  console.log(`✅ Created admin user: ${adminUser.email}`)
  
  // Create cleaner user
  const cleanerUser = await prisma.user.create({
    data: {
      email: 'cleaner@qrtanki.com',
      name: 'Expert Cleaner',
      phone: '+91 98765 43215',
      role: 'CLEANER',
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })
  
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
  console.log(`✅ Created cleaner user: ${cleanerUser.email}`)
  
  // Create regular users
  const regularUsers = [
    {
      email: 'user@qrtanki.com',
      name: 'Regular User',
      phone: '+91 98765 43211',
      role: 'USER'
    },
    {
      email: 'society@qrtanki.com',
      name: 'Society Manager',
      phone: '+91 98765 43212',
      role: 'USER'
    },
    {
      email: 'emergency@qrtanki.com',
      name: 'Emergency User',
      phone: '+91 98765 43213',
      role: 'USER'
    },
    {
      email: 'wallet@qrtanki.com',
      name: 'Wallet User',
      phone: '+91 98765 43214',
      role: 'USER'
    }
  ]
  
  for (const userData of regularUsers) {
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        name: userData.name,
        phone: userData.phone,
        role: userData.role,
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
    console.log(`✅ Created user: ${user.email}`)
  }
}

async function createBasicDemoTanks() {
  console.log('🏗️ Creating basic demo tanks...')
  
  const users = await prisma.user.findMany({
    where: {
      role: 'USER'
    }
  })
  
  const tankData = [
    {
      userId: users[0]?.id,
      name: 'Demo Main Tank',
      type: 'OVERHEAD',
      capacity: '1000 Liters',
      location: 'Demo Rooftop',
      installationDate: new Date('2023-01-01'),
      lastCleanedDate: new Date('2024-01-15'),
      nextDueDate: new Date('2024-02-15'),
      hygieneScore: 4.5,
      isActive: true
    },
    {
      userId: users[0]?.id,
      name: 'Demo Backup Tank',
      type: 'UNDERGROUND',
      capacity: '500 Liters',
      location: 'Demo Backyard',
      installationDate: new Date('2023-01-01'),
      lastCleanedDate: new Date('2023-12-20'),
      nextDueDate: new Date('2024-01-20'),
      hygieneScore: 3.8,
      isActive: true
    },
    {
      userId: users[1]?.id,
      name: 'Demo Society Tank 1',
      type: 'OVERHEAD',
      capacity: '2000 Liters',
      location: 'Demo Society Block A',
      installationDate: new Date('2023-01-01'),
      lastCleanedDate: new Date('2024-01-10'),
      nextDueDate: new Date('2024-02-10'),
      hygieneScore: 4.2,
      isActive: true
    },
    {
      userId: users[1]?.id,
      name: 'Demo Society Tank 2',
      type: 'OVERHEAD',
      capacity: '2000 Liters',
      location: 'Demo Society Block B',
      installationDate: new Date('2023-01-01'),
      lastCleanedDate: new Date('2024-01-12'),
      nextDueDate: new Date('2024-02-12'),
      hygieneScore: 4.0,
      isActive: true
    },
    {
      userId: users[2]?.id,
      name: 'Demo Emergency Tank',
      type: 'OVERHEAD',
      capacity: '1500 Liters',
      location: 'Demo Emergency Location',
      installationDate: new Date('2023-01-01'),
      lastCleanedDate: new Date('2024-01-01'),
      nextDueDate: new Date('2024-02-01'),
      hygieneScore: 2.5,
      isActive: true
    },
    {
      userId: users[3]?.id,
      name: 'Demo Wallet Tank',
      type: 'SINTANK',
      capacity: '1000 Liters',
      location: 'Demo Wallet Location',
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
        data: tank
      })
      console.log(`✅ Created tank: ${createdTank.name}`)
    }
  }
}

async function createBasicDemoQRCodes() {
  console.log('📱 Creating basic demo QR codes...')
  
  const tanks = await prisma.tank.findMany({
    where: {
      name: {
        contains: 'Demo'
      }
    }
  })
  
  for (const tank of tanks) {
    await prisma.qrCode.create({
      data: {
        code: `QT-DEMO-${tank.id.slice(-6)}`,
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

function displayBasicDemoCredentials() {
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
  console.log('    Features: 2 tanks, basic functionality')
  
  console.log('  Society Manager:')
  console.log('    Email: society@qrtanki.com')
  console.log('    Password: Society@123')
  console.log('    Features: Society management, multiple tanks')
  
  console.log('  Emergency User:')
  console.log('    Email: emergency@qrtanki.com')
  console.log('    Password: Emergency@123')
  console.log('    Features: Emergency service testing')
  
  console.log('  Wallet User:')
  console.log('    Email: wallet@qrtanki.com')
  console.log('    Password: Wallet@123')
  console.log('    Features: Wallet functionality testing')
  
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
  
  console.log('\n✅ Basic demo setup completed!')
  console.log('🚀 QR Tanki is ready for testing!')
}

// Export for use in other files
export { setupBasicDemo }

// Run if called directly
if (typeof require !== 'undefined' && require.main === module) {
  setupBasicDemo()
    .catch((e) => {
      console.error('❌ Error in basic demo setup:', e)
      process.exit(1)
    })
}