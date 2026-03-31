import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { cleaningRecordId, rating, comment, isPublic } = await request.json()

    if (!cleaningRecordId || !rating) {
      return NextResponse.json(
        { error: "Cleaning record ID and rating are required" },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      )
    }

    // Verify cleaning record exists and user has access
    const cleaningRecord = await db.cleaningRecord.findFirst({
      where: {
        id: cleaningRecordId,
        tank: {
          userId: session.user.id
        }
      },
      include: {
        tank: true,
        cleaner: {
          include: {
            user: true
          }
        }
      }
    })

    if (!cleaningRecord) {
      return NextResponse.json(
        { error: "Cleaning record not found or unauthorized" },
        { status: 404 }
      )
    }

    // Check if feedback already exists
    const existingFeedback = await db.feedback.findFirst({
      where: {
        userId: session.user.id,
        cleaningRecordId
      }
    })

    if (existingFeedback) {
      return NextResponse.json(
        { error: "Feedback already submitted for this cleaning" },
        { status: 400 }
      )
    }

    // Create feedback
    const feedback = await db.feedback.create({
      data: {
        userId: session.user.id,
        cleaningRecordId,
        rating,
        comment: comment || null,
        isPublic: isPublic !== false
      }
    })

    // Update cleaner's average rating
    const allFeedbacks = await db.feedback.findMany({
      where: {
        cleaningRecord: {
          cleanerId: cleaningRecord.cleanerId
        }
      }
    })

    const averageRating = allFeedbacks.reduce((sum, f) => sum + f.rating, 0) / allFeedbacks.length

    await db.cleaner.update({
      where: {
        id: cleaningRecord.cleanerId
      },
      data: {
        rating: averageRating
      }
    })

    // Create notification for cleaner
    await db.notification.create({
      data: {
        userId: cleaningRecord.cleaner.user.id,
        title: "New Feedback Received",
        message: `You received a ${rating}-star rating for ${cleaningRecord.tank.name}`,
        type: "SYSTEM",
        actionUrl: `/cleaner/feedback`
      }
    })

    return NextResponse.json({
      message: "Feedback submitted successfully",
      feedback
    })
  } catch (error) {
    console.error("Error submitting feedback:", error)
    return NextResponse.json(
      { error: "Failed to submit feedback" },
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
    const cleaningRecordId = searchParams.get('cleaningRecordId')
    const cleanerId = searchParams.get('cleanerId')

    let whereClause: any = {}

    if (cleaningRecordId) {
      whereClause.cleaningRecordId = cleaningRecordId
    } else if (cleanerId) {
      whereClause.cleaningRecord = {
        cleanerId: cleanerId
      }
    } else if (session.user.role === 'USER') {
      whereClause.userId = session.user.id
    }

    const feedbacks = await db.feedback.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            name: true,
            avatar: true
          }
        },
        cleaningRecord: {
          include: {
            tank: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ feedbacks })
  } catch (error) {
    console.error("Error fetching feedback:", error)
    return NextResponse.json(
      { error: "Failed to fetch feedback" },
      { status: 500 }
    )
  }
}