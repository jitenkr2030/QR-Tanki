// API Endpoint for Tank Creation and QR Code Generation
// POST /api/tanks

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

// Map form tank types to database enum values
function mapTankType(formType: string): 'OVERHEAD' | 'UNDERGROUND' | 'SINTANK' {
  const typeMap: { [key: string]: 'OVERHEAD' | 'UNDERGROUND' | 'SINTANK' } = {
    'overhead': 'OVERHEAD',
    'Overhead': 'OVERHEAD',
    'OVERHEAD': 'OVERHEAD',
    'underground': 'UNDERGROUND',
    'Underground': 'UNDERGROUND',
    'UNDERGROUND': 'UNDERGROUND',
    'sintank': 'SINTANK',
    'Sintank': 'SINTANK',
    'SINTANK': 'SINTANK',
    'sump': 'SINTANK',
    'Sum': 'SINTANK',
    'SUM': 'SINTANK',
    'plastic': 'SINTANK',
    'Plastic': 'SINTANK',
    'PLASTIC': 'SINTANK',
    'concrete': 'SINTANK',
    'Concrete': 'SINTANK',
    'CONCRETE': 'SINTANK',
    'stainless steel': 'SINTANK',
    'Stainless Steel': 'SINTANK',
    'STAINLESS STEEL': 'SINTANK'
  }
  
  return typeMap[formType] || 'OVERHEAD' // Default fallback
}

export async function POST(request: NextRequest) {
  try {
    const prisma = getPrismaClient()
    
    if (!prisma) {
      return NextResponse.json({ 
        success: false,
        error: 'DATABASE_URL not configured',
        message: 'Please contact administrator to configure database'
      }, { status: 500 })
    }
    
    const body = await request.json()
    const { name, type, capacity, location, userId } = body

    // Validate required fields
    if (!name || !type || !location || !userId) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields',
        message: 'Please provide name, type, location, and userId'
      }, { status: 400 })
    }

    // Map tank type to database enum
    const tankType = mapTankType(type)

    // Generate unique QR code
    const qrCode = `QT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Create tank with QR code
    const tank = await prisma.tank.create({
      data: {
        name,
        type: tankType,
        capacity,
        location,
        userId,
        hygieneScore: 0,
        isActive: true,
        qrCode: {
          create: {
            code: qrCode,
            isGenerated: true,
            isPaid: false, // Will be updated when payment is made
          }
        }
      },
      include: {
        qrCode: true
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Tank created successfully with QR code',
      tank: {
        id: tank.id,
        name: tank.name,
        type: tank.type,
        capacity: tank.capacity,
        location: tank.location,
        qrCode: tank.qrCode
      },
      qrCode: qrCode,
      paymentRequired: {
        amount: 499,
        description: 'One-time payment for QR code sticker generation'
      }
    })

  } catch (error) {
    console.error('Error creating tank:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create tank',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
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
        error: 'DATABASE_URL not configured',
        message: 'Please contact administrator to configure database'
      }, { status: 500 })
    }

    // Get all tanks for the user (if userId is provided in query)
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'Missing userId parameter',
        message: 'Please provide userId to fetch tanks'
      }, { status: 400 })
    }

    const tanks = await prisma.tank.findMany({
      where: { userId },
      include: {
        qrCode: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      tanks,
      count: tanks.length
    })

  } catch (error) {
    console.error('Error fetching tanks:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch tanks',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  } finally {
    const prisma = getPrismaClient()
    if (prisma) {
      await prisma.$disconnect()
    }
  }
}