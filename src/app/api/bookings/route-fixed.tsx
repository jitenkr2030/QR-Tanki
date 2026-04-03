// Fixed Bookings API Route
// Compatible with Vercel build and Turbopack

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-fixed"
import { db } from "@/lib/db"
import { CleaningType, TaskStatus } from "@prisma/client"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { tankId, cleaningType, scheduledDate, preferredTime, urgencyLevel = 1 } = body

    // Validate input
    if (!tankId || !cleaningType || !scheduledDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create cleaning request
    const cleaningRequest = await db.cleaningRequest.create({
      data: {
        userId: session.user.id,
        tankId,
        cleaningType: cleaningType as CleaningType,
        requestedDate: new Date(),
        scheduledDate: new Date(scheduledDate),
        preferredTime: preferredTime || "10:00 AM",
        urgencyLevel,
        status: TaskStatus.PENDING,
      },
    })

    return NextResponse.json(cleaningRequest, { status: 201 })
  } catch (error) {
    console.error('Booking error:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const bookings = await db.cleaningRequest.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        tank: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(bookings)
  } catch (error) {
    console.error('Get bookings error:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}