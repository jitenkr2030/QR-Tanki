'use server'

import { db } from "@/lib/db"
import { UserRole } from "@prisma/client"

interface SignUpData {
  name: string
  email: string
  phone?: string
  password: string
  role: UserRole
}

export async function signUp(data: SignUpData) {
  try {
    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: data.email }
    })

    if (existingUser) {
      return { error: "A user with this email already exists" }
    }

    // Create new user (in production, hash the password)
    const user = await db.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
        // In production, store hashed password
        // For demo, we're not implementing password hashing
      }
    })

    // If user is a cleaner, create cleaner profile
    if (data.role === 'CLEANER') {
      await db.cleaner.create({
        data: {
          userId: user.id,
          experience: "",
          serviceArea: "",
          rating: 0,
          totalJobs: 0,
          isAvailable: true,
          bio: ""
        }
      })
    }

    return { success: true, user }
  } catch (error) {
    console.error("Sign up error:", error)
    return { error: "Failed to create account. Please try again." }
  }
}