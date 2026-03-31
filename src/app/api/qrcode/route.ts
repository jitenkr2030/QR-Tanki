import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import QRCode from "qrcode"
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

    const { tankId } = await request.json()

    if (!tankId) {
      return NextResponse.json(
        { error: "Tank ID is required" },
        { status: 400 }
      )
    }

    // Check if tank belongs to user
    const tank = await db.tank.findFirst({
      where: {
        id: tankId,
        userId: session.user.id
      },
      include: {
        qrCode: true
      }
    })

    if (!tank) {
      return NextResponse.json(
        { error: "Tank not found or unauthorized" },
        { status: 404 }
      )
    }

    // Check if QR code already exists
    if (tank.qrCode) {
      return NextResponse.json(
        { error: "QR code already generated for this tank" },
        { status: 400 }
      )
    }

    // Generate unique QR code
    const qrCodeValue = `QT-${Date.now().toString().slice(-6)}`
    
    // Generate QR code image
    const qrCodeDataURL = await QRCode.toDataURL(qrCodeValue, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })

    // Create QR code record
    const qrCode = await db.qRCode.create({
      data: {
        code: qrCodeValue,
        isGenerated: true,
        isPaid: false,
        generatedAt: new Date()
      }
    })

    // Update tank with QR code ID
    await db.tank.update({
      where: { id: tankId },
      data: { qrCodeId: qrCode.id }
    })

    return NextResponse.json({
      message: "QR code generated successfully",
      qrCode: {
        id: qrCode.id,
        code: qrCodeValue,
        image: qrCodeDataURL,
        isPaid: false
      }
    })
  } catch (error) {
    console.error("Error generating QR code:", error)
    return NextResponse.json(
      { error: "Failed to generate QR code" },
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
    const code = searchParams.get('code')

    if (!code) {
      return NextResponse.json(
        { error: "QR code is required" },
        { status: 400 }
      )
    }

    // Find QR code and get tank details
    const qrCode = await db.qRCode.findUnique({
      where: { code },
      include: {
        tank: {
          include: {
            user: {
              select: {
                name: true,
                phone: true
              }
            },
            cleaningRecords: {
              include: {
                cleaner: {
                  include: {
                    user: {
                      select: {
                        name: true
                      }
                    }
                  }
                }
              },
              orderBy: {
                cleanedAt: 'desc'
              },
              take: 5
            }
          }
        },
        payment: true
      }
    })

    if (!qrCode || !qrCode.tank) {
      return NextResponse.json(
        { error: "QR code not found or tank not linked" },
        { status: 404 }
      )
    }

    const tank = qrCode.tank

    return NextResponse.json({
      tank: {
        id: tank.id,
        name: tank.name,
        type: tank.type,
        capacity: tank.capacity,
        location: tank.location,
        installationDate: tank.installationDate,
        lastCleanedDate: tank.lastCleanedDate,
        nextDueDate: tank.nextDueDate,
        hygieneScore: tank.hygieneScore,
        owner: tank.user
      },
      cleaningHistory: tank.cleaningRecords.map(record => ({
        id: record.id,
        cleaningType: record.cleaningType,
        cleanedAt: record.cleanedAt,
        hygieneScore: record.hygieneScore,
        cleaner: record.cleaner.user.name,
        notes: record.notes,
        duration: record.duration
      })),
      qrCode: {
        code: qrCode.code,
        isPaid: qrCode.isPaid,
        generatedAt: qrCode.generatedAt
      }
    })
  } catch (error) {
    console.error("Error scanning QR code:", error)
    return NextResponse.json(
      { error: "Failed to scan QR code" },
      { status: 500 }
    )
  }
}