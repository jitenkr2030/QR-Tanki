import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    // Create demo users if they don't exist
    const demoUsers = [
      {
        email: 'user@qrtanki.com',
        name: 'Demo User',
        role: 'USER',
        phone: '+91 98765 43210',
        isVerified: true,
      },
      {
        email: 'admin@qrtanki.com',
        name: 'Admin User',
        role: 'ADMIN',
        phone: '+91 98765 43211',
        isVerified: true,
      },
      {
        email: 'cleaner@qrtanki.com',
        name: 'Cleaner User',
        role: 'CLEANER',
        phone: '+91 98765 43212',
        isVerified: true,
      }
    ]

    const createdUsers = []
    
    for (const userData of demoUsers) {
      const existingUser = await db.user.findUnique({
        where: { email: userData.email }
      })

      if (!existingUser) {
        const newUser = await db.user.create({
          data: userData
        })
        createdUsers.push(newUser)
        console.log(`Created demo user: ${userData.email}`)
      } else {
        createdUsers.push(existingUser)
        console.log(`Demo user already exists: ${userData.email}`)
      }
    }

    // Create cleaner profile for the demo cleaner
    const cleanerUser = createdUsers.find(u => u.email === 'cleaner@qrtanki.com')
    if (cleanerUser && cleanerUser.role === 'CLEANER') {
      const existingCleaner = await db.cleaner.findUnique({
        where: { userId: cleanerUser.id }
      })

      if (!existingCleaner) {
        await db.cleaner.create({
          data: {
            userId: cleanerUser.id,
            experience: '2 years',
            serviceArea: 'Mumbai, Pune, Bangalore',
            rating: 4.5,
            totalJobs: 150,
            isAvailable: true,
            bio: 'Professional water tank cleaning specialist'
          }
        })
        console.log('Created cleaner profile for demo cleaner')
      }
    }

    return NextResponse.json({
      message: 'Demo users created successfully',
      users: createdUsers.map(u => ({
        id: u.id,
        email: u.email,
        name: u.name,
        role: u.role
      }))
    })

  } catch (error) {
    console.error('Error creating demo users:', error)
    return NextResponse.json(
      { error: 'Failed to create demo users' },
      { status: 500 }
    )
  }
}