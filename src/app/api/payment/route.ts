// Payment API Endpoint for QR Tanki Platform
// POST /api/payment

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
        message: 'Please contact administrator to configure database'
      }, { status: 500 })
    }
    
    const body = await request.json()
    const {
      paymentMethod,
      amount,
      transactionId,
      paymentProof,
      customerName,
      customerPhone,
      customerEmail,
      notes,
      qrCodeId,
      tankId,
      userId
    } = body

    // Validate required fields
    if (!paymentMethod || !amount || !customerName || !customerPhone || !qrCodeId || !tankId || !userId) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields',
        message: 'Please provide all required payment information'
      }, { status: 400 })
    }

    // Validate payment method specific fields
    if (paymentMethod === 'upi' && !transactionId) {
      return NextResponse.json({
        success: false,
        error: 'Transaction ID required for UPI payment',
        message: 'Please provide UPI transaction ID'
      }, { status: 400 })
    }

    if (paymentMethod === 'cash' && !paymentProof) {
      return NextResponse.json({
        success: false,
        error: 'Payment proof required for cash payment',
        message: 'Please provide cash receipt number'
      }, { status: 400 })
    }

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        amount,
        method: paymentMethod.toUpperCase(),
        transactionId: transactionId || null,
        paymentProof: paymentProof || null,
        status: 'PENDING',
        customerName,
        customerPhone,
        customerEmail,
        notes,
        userId,
        qrCodeId
      }
    })

    // Update QR code status (in real implementation, this would be done after admin verification)
    // For demo purposes, we'll mark it as paid immediately
    await prisma.qrCode.update({
      where: { id: qrCodeId },
      data: { isPaid: true }
    })

    // In a real implementation, you would:
    // 1. Send confirmation email to customer
    // 2. Send notification to admin for verification
    // 3. Create service activation task
    // 4. Log payment for accounting

    return NextResponse.json({
      success: true,
      message: 'Payment processed successfully',
      payment: {
        id: payment.id,
        amount: payment.amount,
        method: payment.method,
        status: payment.status,
        transactionId: payment.transactionId,
        customerName: payment.customerName,
        createdAt: payment.createdAt
      },
      nextSteps: {
        verification: 'Payment will be verified within 24 hours',
        activation: 'Service will be activated after verification',
        confirmation: 'You will receive confirmation via email and phone'
      }
    })

  } catch (error) {
    console.error('Error processing payment:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to process payment',
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

    // Get payment details by ID
    const { searchParams } = new URL(request.url)
    const paymentId = searchParams.get('id')

    if (!paymentId) {
      return NextResponse.json({
        success: false,
        error: 'Payment ID required',
        message: 'Please provide payment ID to fetch details'
      }, { status: 400 })
    }

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        qrCode: {
          select: {
            id: true,
            code: true,
            isPaid: true,
            tank: {
              select: {
                id: true,
                name: true,
                type: true,
                capacity: true,
                location: true
              }
            }
          }
        }
      }
    })

    if (!payment) {
      return NextResponse.json({
        success: false,
        error: 'Payment not found',
        message: 'The specified payment ID does not exist'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      payment,
      qrCode: payment.qrCode
    })

  } catch (error) {
    console.error('Error fetching payment:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch payment',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  } finally {
    const prisma = getPrismaClient()
    if (prisma) {
      await prisma.$disconnect()
    }
  }
}