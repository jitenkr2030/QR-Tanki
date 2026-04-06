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

    // Fetch user's cleaning history from database
    const cleanings = await db.cleaning.findMany({
      where: {
        tank: {
          userId: session.user.id
        }
      },
      include: {
        tank: {
          select: {
            name: true
          }
        },
        cleaner: {
          select: {
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
      }
    })

    // Transform data to match expected format
    const transformedCleanings = cleanings.map(cleaning => ({
      id: cleaning.id,
      cleaningType: cleaning.cleaningType,
      cleanedAt: cleaning.cleanedAt?.toISOString().split('T')[0] || '',
      hygieneScore: cleaning.hygieneScore,
      cleaner: {
        user: {
          name: cleaning.cleaner?.user?.name || 'Unknown'
        }
      }
    }))

    return NextResponse.json(transformedCleanings)
  } catch (error) {
    console.error('Error fetching cleaning history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cleaning history' },
      { status: 500 }
    )
  }
}