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

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    // Get user's tanks
    const tanks = await db.tank.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        cleanings: {
          where: {
            cleanedAt: {
              gte: startOfLastMonth
            }
          },
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
      }
    })

    // Calculate stats
    const totalTanks = tanks.length

    // Cleanings this month
    const cleaningsThisMonth = tanks.reduce((count, tank) => {
      return count + tank.cleanings.filter(c => c.cleanedAt >= startOfMonth).length
    }, 0)

    // Cleanings last month
    const cleaningsLastMonth = tanks.reduce((count, tank) => {
      return count + tank.cleanings.filter(c => 
        c.cleanedAt >= startOfLastMonth && c.cleanedAt <= endOfLastMonth
      ).length
    }, 0)

    // Average hygiene score
    const allCleanings = tanks.flatMap(tank => tank.cleanings)
    const avgHygieneScore = allCleanings.length > 0 
      ? allCleanings.reduce((sum, c) => sum + (c.hygieneScore || 0), 0) / allCleanings.length
      : 0

    // Next cleaning due (soonest upcoming due date)
    const upcomingTanks = tanks
      .filter(tank => tank.nextDueDate && tank.nextDueDate > now)
      .sort((a, b) => a.nextDueDate!.getTime() - b.nextDueDate!.getTime())
    
    const nextCleaningDue = upcomingTanks.length > 0 
      ? Math.ceil((upcomingTanks[0].nextDueDate!.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      : null

    const stats = {
      totalTanks,
      cleaningsThisMonth,
      cleaningsLastMonth,
      avgHygieneScore: Math.round(avgHygieneScore * 10) / 10,
      nextCleaningDue,
      nextCleaningDueTank: upcomingTanks[0]?.name || null
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}