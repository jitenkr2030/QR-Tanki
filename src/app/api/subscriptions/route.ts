import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { SubscriptionPlan } from "@prisma/client"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { plan, autoRenew } = await request.json()

    if (!plan) {
      return NextResponse.json(
        { error: "Subscription plan is required" },
        { status: 400 }
      )
    }

    // Check if user already has an active subscription
    const existingSubscription = await db.subscription.findFirst({
      where: {
        userId: session.user.id,
        isActive: true
      }
    })

    if (existingSubscription) {
      return NextResponse.json(
        { error: "You already have an active subscription" },
        { status: 400 }
      )
    }

    // Calculate subscription details (Yearly Only)
    const planDetails = {
      BASIC: {
        monthlyAmount: 99,
        yearlyAmount: 999,
        cleaningFrequency: 2
      },
      PREMIUM: {
        monthlyAmount: 199,
        yearlyAmount: 1999,
        cleaningFrequency: 2
      }
    }

    const selectedPlan = planDetails[plan as keyof typeof planDetails]
    if (!selectedPlan) {
      return NextResponse.json(
        { error: "Invalid subscription plan" },
        { status: 400 }
      )
    }

    // Always use yearly billing
    const amount = selectedPlan.yearlyAmount
    const billingCycle = 'yearly'
    const startDate = new Date()
    const endDate = new Date()
    endDate.setFullYear(endDate.getFullYear() + 1)

    // Create subscription
    const subscription = await db.subscription.create({
      data: {
        userId: session.user.id,
        plan: plan as SubscriptionPlan,
        amount,
        billingCycle,
        startDate,
        endDate,
        isActive: false, // Will be activated after payment
        autoRenew: autoRenew || false,
        cleaningFrequency: selectedPlan.cleaningFrequency
      }
    })

    // Create payment record
    await db.payment.create({
      data: {
        userId: session.user.id,
        subscriptionId: subscription.id,
        amount,
        type: "SUBSCRIPTION",
        billingCycle,
        status: "PENDING"
      }
    })

    return NextResponse.json({
      message: "Subscription created successfully",
      subscription
    })
  } catch (error) {
    console.error("Error creating subscription:", error)
    return NextResponse.json(
      { error: "Failed to create subscription" },
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

    const subscriptions = await db.subscription.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        payments: true,
        _count: {
          select: {
            payments: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ subscriptions })
  } catch (error) {
    console.error("Error fetching subscriptions:", error)
    return NextResponse.json(
      { error: "Failed to fetch subscriptions" },
      { status: 500 }
    )
  }
}