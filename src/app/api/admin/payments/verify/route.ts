// Admin Payment Verification API
// POST /api/admin/payments/verify

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
    const { paymentId, action, adminNotes } = body

    // Validate required fields
    if (!paymentId || !action) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields',
        message: 'Please provide payment ID and action'
      }, { status: 400 })
    }

    // Validate action
    if (!['verify', 'reject', 'activate'].includes(action)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid action',
        message: 'Action must be verify, reject, or activate'
      }, { status: 400 })
    }

    // Get payment details
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
          include: {
            tank: {
              select: {
                id: true,
                name: true,
                type: true,
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

    let updatedPayment
    let updatedQrCode

    switch (action) {
      case 'verify':
        updatedPayment = await prisma.payment.update({
          where: { id: paymentId },
          data: {
            status: 'VERIFIED',
            verifiedAt: new Date(),
            adminNotes
          }
        })
        break

      case 'reject':
        updatedPayment = await prisma.payment.update({
          where: { id: paymentId },
          data: {
            status: 'REJECTED',
            verifiedAt: new Date(),
            adminNotes
          }
        })
        // Revert QR code payment status
        updatedQrCode = await prisma.qrCode.update({
          where: { id: payment.qrCodeId },
          data: { isPaid: false }
        })
        break

      case 'activate':
        updatedPayment = await prisma.payment.update({
          where: { id: paymentId },
          data: {
            status: 'COMPLETED',
            activatedAt: new Date(),
            adminNotes
          }
        })
        // Ensure QR code is marked as paid
        updatedQrCode = await prisma.qrCode.update({
          where: { id: payment.qrCodeId },
          data: { isPaid: true }
        })
        break
    }

    // In a real implementation, you would:
    // 1. Send confirmation email to customer
    // 2. Send SMS notification
    // 3. Create service activation record
    // 4. Log admin action for audit

    return NextResponse.json({
      success: true,
      message: `Payment ${action} successfully`,
      payment: updatedPayment,
      customer: {
        name: payment.user.name,
        email: payment.user.email,
        phone: payment.user.phone
      },
      tank: payment.qrCode.tank,
      qrCode: payment.qrCode,
      nextSteps: {
        email: 'Confirmation email will be sent to customer',
        activation: action === 'activate' ? 'Service has been activated' : 'Service will be activated after verification',
        support: 'Customer can contact support for any queries'
      }
    })

  } catch (error) {
    console.error('Error verifying payment:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to verify payment',
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

    // Get all pending payments for admin verification
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'PENDING'

    const payments = await prisma.payment.findMany({
      where: { status },
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
          include: {
            tank: {
              select: {
                id: true,
                name: true,
                type: true,
                location: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      payments,
      count: payments.length,
      summary: {
        pending: payments.filter(p => p.status === 'PENDING').length,
        verified: payments.filter(p => p.status === 'VERIFIED').length,
        completed: payments.filter(p => p.status === 'COMPLETED').length,
        rejected: payments.filter(p => p.status === 'REJECTED').length
      }
    })

  } catch (error) {
    console.error('Error fetching payments:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch payments',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  } finally {
    const prisma = getPrismaClient()
    if (prisma) {
      await prisma.$disconnect()
    }
  }
}