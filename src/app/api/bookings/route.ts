import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { CleaningType, TaskStatus } from "@prisma/client"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { tankId, cleaningType, scheduledDate, preferredTime, notes, urgencyLevel } = await request.json()

    if (!tankId || !cleaningType || !scheduledDate) {
      return NextResponse.json(
        { error: "Tank ID, cleaning type, and scheduled date are required" },
        { status: 400 }
      )
    }

    // Verify tank belongs to user
    const tank = await db.tank.findFirst({
      where: {
        id: tankId,
        userId: session.user.id
      }
    })

    if (!tank) {
      return NextResponse.json(
        { error: "Tank not found or unauthorized" },
        { status: 404 }
      )
    }

    // Create cleaning request
    const cleaningRequest = await db.cleaningRequest.create({
      data: {
        userId: session.user.id,
        tankId,
        cleaningType: cleaningType as CleaningType,
        requestedDate: new Date(),
        scheduledDate: new Date(scheduledDate),
        preferredTime: preferredTime || null,
        notes: notes || null,
        urgencyLevel: urgencyLevel || 1,
        status: TaskStatus.PENDING
      },
      include: {
        tank: {
          include: {
            user: {
              select: {
                name: true,
                phone: true
              }
            }
          }
        }
      }
    })

    // Create payment record for one-time cleaning
    const cleaningPrice = cleaningType === 'BASIC' ? 699 : cleaningType === 'DEEP' ? 899 : 1299
    
    await db.payment.create({
      data: {
        userId: session.user.id,
        requestId: cleaningRequest.id,
        amount: cleaningPrice,
        type: "CLEANING",
        status: "PENDING"
      }
    })

    // Create notification for available cleaners (in production, this would be more sophisticated)
    await db.notification.create({
      data: {
        title: "New Cleaning Request",
        message: `New ${cleaningType} cleaning request for ${tank.name}`,
        type: "BOOKING",
        actionUrl: `/cleaner/requests`
      }
    })

    return NextResponse.json({
      message: "Cleaning request created successfully",
      request: cleaningRequest
    })
  } catch (error) {
    console.error("Error creating booking:", error)
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    let whereClause: any = {
      userId: session.user.id
    }

    if (status) {
      whereClause.status = status
    }

    const bookings = await db.cleaningRequest.findMany({
      where: whereClause,
      include: {
        tank: true,
        cleaner: {
          include: {
            user: {
              select: {
                name: true,
                phone: true
              }
            }
          }
        },
        cleaningRecord: true,
        payment: true
      },
      orderBy: {
        requestedDate: 'desc'
      }
    })

    return NextResponse.json({ bookings })
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    )
  }
}