import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch user's tanks from database
    const tanks = await db.tank.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        qrCode: true,
        cleanings: {
          orderBy: {
            cleanedAt: 'desc'
          },
          take: 1,
          include: {
            cleaner: {
              select: {
                user: {
                  select: {
                    name: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform data to match expected format
    const transformedTanks = tanks.map(tank => ({
      id: tank.id,
      name: tank.name,
      type: tank.type,
      capacity: tank.capacity ? `${tank.capacity} Liters` : undefined,
      location: tank.location || 'Not specified',
      lastCleanedDate: tank.cleanings[0]?.cleanedAt?.toISOString().split('T')[0] || undefined,
      nextDueDate: tank.nextDueDate?.toISOString().split('T')[0] || undefined,
      hygieneScore: tank.cleanings[0]?.hygieneScore || undefined,
      qrCode: {
        code: tank.qrCode?.code || `QT-${tank.id.slice(-6)}`,
        isPaid: tank.qrCode?.isPaid || false
      }
    }))

    return NextResponse.json(transformedTanks)
  } catch (error) {
    console.error('Error fetching tanks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tanks' },
      { status: 500 }
    )
  }
}