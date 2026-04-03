import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { UserRole, SubscriptionPlan, CleaningType, PaymentStatus, TaskStatus } from "@prisma/client"

export async function POST(request: NextRequest) {
  try {
    // Create demo users
    const homeowner = await db.user.upsert({
      where: { email: "homeowner@qrtanki.com" },
      update: {},
      create: {
        email: "homeowner@qrtanki.com",
        name: "Rahul Sharma",
        phone: "+91 98765 43210",
        role: UserRole.USER
      }
    })

    const cleaner = await db.user.upsert({
      where: { email: "cleaner@qrtanki.com" },
      update: {},
      create: {
        email: "cleaner@qrtanki.com",
        name: "Amit Kumar",
        phone: "+91 98765 43211",
        role: UserRole.CLEANER
      }
    })

    const admin = await db.user.upsert({
      where: { email: "admin@qrtanki.com" },
      update: {},
      create: {
        email: "admin@qrtanki.com",
        name: "Admin User",
        phone: "+91 98765 43212",
        role: UserRole.ADMIN
      }
    })

    // Create cleaner profile
    const cleanerProfile = await db.cleaner.upsert({
      where: { userId: cleaner.id },
      update: {},
      create: {
        userId: cleaner.id,
        experience: "5 years",
        serviceArea: "Mumbai, Pune, Thane",
        rating: 4.5,
        totalJobs: 150,
        isAvailable: true,
        bio: "Professional tank cleaning specialist with expertise in water hygiene and safety."
      }
    })

    // Create QR codes
    const qrCode1 = await db.qRCode.create({
      data: {
        code: "QT-123456",
        isGenerated: true,
        isPaid: true,
        generatedAt: new Date()
      }
    })

    const qrCode2 = await db.qRCode.create({
      data: {
        code: "QT-789012",
        isGenerated: true,
        isPaid: true,
        generatedAt: new Date()
      }
    })

    // Create tanks
    const tank1 = await db.tank.create({
      data: {
        userId: homeowner.id,
        qrCodeId: qrCode1.id,
        name: "Main Water Tank",
        type: "Overhead",
        capacity: "1000 Liters",
        location: "Rooftop - Building A",
        installationDate: new Date("2022-01-15"),
        lastCleanedDate: new Date("2024-01-15"),
        nextDueDate: new Date("2024-02-15"),
        hygieneScore: 4.5,
        isActive: true
      }
    })

    const tank2 = await db.tank.create({
      data: {
        userId: homeowner.id,
        qrCodeId: qrCode2.id,
        name: "Backup Tank",
        type: "Underground",
        capacity: "500 Liters",
        location: "Backyard",
        installationDate: new Date("2022-06-20"),
        lastCleanedDate: new Date("2023-12-20"),
        nextDueDate: new Date("2024-01-20"),
        hygieneScore: 3.8,
        isActive: true
      }
    })

    // Create subscription
    const subscription = await db.subscription.create({
      data: {
        userId: homeowner.id,
        plan: SubscriptionPlan.BASIC,
        amount: 399,
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-12-31"),
        isActive: true,
        autoRenew: false,
        cleaningFrequency: 1
      }
    })

    // Create cleaning records
    const cleaningRecord1 = await db.cleaningRecord.create({
      data: {
        tankId: tank1.id,
        cleanerId: cleanerProfile.id,
        cleaningType: CleaningType.BASIC,
        cleanedAt: new Date("2024-01-15"),
        duration: 45,
        beforePhotos: JSON.stringify(["/photos/before1.jpg", "/photos/before2.jpg"]),
        afterPhotos: JSON.stringify(["/photos/after1.jpg", "/photos/after2.jpg"]),
        notes: "Tank was moderately dirty. Basic cleaning completed successfully.",
        hygieneScore: 4.5,
        isVerified: true,
        verifiedBy: admin.id
      }
    })

    const cleaningRecord2 = await db.cleaningRecord.create({
      data: {
        tankId: tank2.id,
        cleanerId: cleanerProfile.id,
        cleaningType: CleaningType.DEEP,
        cleanedAt: new Date("2023-12-20"),
        duration: 90,
        beforePhotos: JSON.stringify(["/photos/before3.jpg"]),
        afterPhotos: JSON.stringify(["/photos/after3.jpg"]),
        notes: "Deep cleaning performed. Removed sediment and disinfected thoroughly.",
        hygieneScore: 4.2,
        isVerified: true,
        verifiedBy: admin.id
      }
    })

    // Create payments
    await db.payment.createMany({
      data: [
        {
          userId: homeowner.id,
          qrCodeId: qrCode1.id,
          amount: 499,
          type: "QR_GENERATION",
          status: PaymentStatus.COMPLETED,
          paymentMethod: "UPI",
          transactionId: "TXN123456",
          paidAt: new Date("2024-01-01")
        },
        {
          userId: homeowner.id,
          qrCodeId: qrCode2.id,
          amount: 499,
          type: "QR_GENERATION",
          status: PaymentStatus.COMPLETED,
          paymentMethod: "CARD",
          transactionId: "TXN789012",
          paidAt: new Date("2024-01-02")
        },
        {
          userId: homeowner.id,
          subscriptionId: subscription.id,
          amount: 399,
          type: "SUBSCRIPTION",
          status: PaymentStatus.COMPLETED,
          paymentMethod: "UPI",
          transactionId: "TXN345678",
          paidAt: new Date("2024-01-01")
        }
      ]
    })

    // Create earnings for cleaner
    await db.earning.createMany({
      data: [
        {
          cleanerId: cleanerProfile.id,
          requestId: cleaningRecord1.id,
          amount: 300,
          commission: 60,
          netAmount: 240,
          earnedAt: new Date("2024-01-15"),
          isPaid: true,
          paidAt: new Date("2024-01-20")
        },
        {
          cleanerId: cleanerProfile.id,
          requestId: cleaningRecord2.id,
          amount: 500,
          commission: 100,
          netAmount: 400,
          earnedAt: new Date("2023-12-20"),
          isPaid: true,
          paidAt: new Date("2024-01-05")
        }
      ]
    })

    // Create feedback
    await db.feedback.createMany({
      data: [
        {
          userId: homeowner.id,
          cleaningRecordId: cleaningRecord1.id,
          rating: 5,
          comment: "Excellent service! Very professional and thorough cleaning.",
          isPublic: true
        },
        {
          userId: homeowner.id,
          cleaningRecordId: cleaningRecord2.id,
          rating: 4,
          comment: "Good deep cleaning service. Tank looks much better now.",
          isPublic: true
        }
      ]
    })

    // Create notifications
    await db.notification.createMany({
      data: [
        {
          userId: homeowner.id,
          title: "Cleaning Due Reminder",
          message: "Your Main Water Tank is due for cleaning on February 15, 2024.",
          type: "REMINDER",
          actionUrl: "/bookings/new"
        },
        {
          userId: homeowner.id,
          title: "Payment Successful",
          message: "Your subscription payment of ₹399 has been processed successfully.",
          type: "PAYMENT",
          actionUrl: "/subscriptions"
        },
        {
          userId: cleaner.id,
          title: "New Cleaning Request",
          message: "You have a new cleaning request in your area.",
          type: "BOOKING",
          actionUrl: "/cleaner/requests"
        }
      ]
    })

    return NextResponse.json({ 
      message: "Demo data created successfully",
      users: {
        homeowner: homeowner.email,
        cleaner: cleaner.email,
        admin: admin.email
      }
    })
  } catch (error) {
    console.error("Error creating demo data:", error)
    return NextResponse.json(
      { error: "Failed to create demo data" },
      { status: 500 }
    )
  }
}