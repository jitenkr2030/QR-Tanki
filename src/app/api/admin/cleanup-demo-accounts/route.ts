// API Endpoint to Remove Demo Accounts from Database
// POST /api/admin/cleanup-demo-accounts

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

    // Demo accounts to remove
    const accountsToRemove = [
      'emergency@qrtanki.com',
      'wallet@qrtanki.com'
    ]

    let removedUsers = []
    let removedCleaners = []
    let removedTanks = []
    let removedQRCodes = []
    let removedBookings = []
    let removedPayments = []
    let removedSubscriptions = []
    let removedCleaningRecords = []
    let removedFeedbacks = []
    let removedEarnings = []
    let removedWallets = []
    let removedTransactions = []
    let removedWalletBalances = []

    // Remove users and their related data
    for (const email of accountsToRemove) {
      // Find user
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          cleaner: true,
          tanks: {
            include: {
              qrCode: true,
              cleaningRecords: true,
              cleaningRequests: {
                include: {
                  payments: true,
                  cleaningRecords: true,
                  feedbacks: true
                }
              }
            }
          },
          payments: true,
          subscriptions: true,
          feedbacks: true,
          wallet: {
            include: {
              walletBalances: true,
              transactions: true
            }
          }
        }
      })

      if (!user) {
        console.log(`User ${email} not found, skipping...`)
        continue
      }

      // Remove related data
      if (user.cleaner) {
        // Remove cleaner earnings
        await prisma.earning.deleteMany({
          where: { cleanerId: user.cleaner.id }
        })
        removedEarnings.push(user.cleaner.id)

        // Remove cleaner
        await prisma.cleaner.delete({
          where: { id: user.cleaner.id }
        })
        removedCleaners.push(user.cleaner.id)
      }

      // Remove tank-related data
      for (const tank of user.tanks) {
        // Remove cleaning records
        if (tank.cleaningRecords.length > 0) {
          await prisma.cleaningRecord.deleteMany({
            where: { tankId: tank.id }
          })
          removedCleaningRecords.push(...tank.cleaningRecords.map(r => r.id))
        }

        // Remove cleaning requests
        if (tank.cleaningRequests.length > 0) {
          for (const request of tank.cleaningRequests) {
            // Remove related payments
            if (request.payments.length > 0) {
              await prisma.payment.deleteMany({
                where: { requestId: request.id }
              })
              removedPayments.push(...request.payments.map(p => p.id))
            }

            // Remove related cleaning records
            if (request.cleaningRecords.length > 0) {
              await prisma.cleaningRecord.deleteMany({
                where: { requestId: request.id }
              })
              removedCleaningRecords.push(...request.cleaningRecords.map(r => r.id))
            }

            // Remove related feedbacks
            if (request.feedbacks.length > 0) {
              await prisma.feedback.deleteMany({
                where: { cleaningRecordId: { in: request.cleaningRecords.map(r => r.id) } }
              })
              removedFeedbacks.push(...request.feedbacks.map(f => f.id))
            }
          }

          await prisma.cleaningRequest.deleteMany({
            where: { tankId: tank.id }
          })
        }

        // Remove QR code
        if (tank.qrCode) {
          await prisma.qrCode.delete({
            where: { id: tank.qrCode.id }
          })
          removedQRCodes.push(tank.qrCode.id)
        }

        // Remove tank
        await prisma.tank.delete({
          where: { id: tank.id }
        })
        removedTanks.push(tank.id)
      }

      // Remove user payments
      if (user.payments.length > 0) {
        await prisma.payment.deleteMany({
          where: { userId: user.id }
        })
        removedPayments.push(...user.payments.map(p => p.id))
      }

      // Remove user subscriptions
      if (user.subscriptions.length > 0) {
        await prisma.subscription.deleteMany({
          where: { userId: user.id }
        })
        removedSubscriptions.push(...user.subscriptions.map(s => s.id))
      }

      // Remove user feedbacks
      if (user.feedbacks.length > 0) {
        await prisma.feedback.deleteMany({
          where: { userId: user.id }
        })
        removedFeedbacks.push(...user.feedbacks.map(f => f.id))
      }

      // Remove wallet data
      if (user.wallet) {
        // Remove wallet balances
        if (user.wallet.walletBalances.length > 0) {
          await prisma.walletBalance.deleteMany({
            where: { walletId: user.wallet.id }
          })
          removedWalletBalances.push(...user.wallet.walletBalances.map(wb => wb.id))
        }

        // Remove wallet transactions
        if (user.wallet.transactions.length > 0) {
          await prisma.transaction.deleteMany({
            where: { walletId: user.wallet.id }
          })
          removedTransactions.push(...user.wallet.transactions.map(t => t.id))
        }

        // Remove wallet
        await prisma.wallet.delete({
          where: { id: user.wallet.id }
        })
        removedWallets.push(user.wallet.id)
      }

      // Finally remove the user
      await prisma.user.delete({
        where: { id: user.id }
      })
      removedUsers.push(user.id)
    }

    return NextResponse.json({
      success: true,
      message: 'Demo accounts removed successfully',
      removed: {
        users: removedUsers.length,
        cleaners: removedCleaners.length,
        tanks: removedTanks.length,
        qrCodes: removedQRCodes.length,
        bookings: removedBookings.length,
        payments: removedPayments.length,
        subscriptions: removedSubscriptions.length,
        cleaningRecords: removedCleaningRecords.length,
        feedbacks: removedFeedbacks.length,
        earnings: removedEarnings.length,
        wallets: removedWallets.length,
        transactions: removedTransactions.length,
        walletBalances: removedWalletBalances.length
      },
      accountsRemoved: accountsToRemove
    })

  } catch (error) {
    console.error('Error removing demo accounts:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to remove demo accounts',
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

    // Check if demo accounts exist
    const demoAccounts = [
      'emergency@qrtanki.com',
      'wallet@qrtanki.com'
    ]

    const existingAccounts = []
    for (const email of demoAccounts) {
      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true
        }
      })

      if (user) {
        existingAccounts.push(user)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Demo account check completed',
      existingAccounts: existingAccounts,
      accountsToRemove: demoAccounts,
      accountsFound: existingAccounts.length
    })

  } catch (error) {
    console.error('Error checking demo accounts:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to check demo accounts',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  } finally {
    const prisma = getPrismaClient()
    if (prisma) {
      await prisma.$disconnect()
    }
  }
}