// Extended NextAuth types for QR Tanki Platform
// Includes custom fields for cleaner, wallet, and additional user data

import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
      phone: string
      avatar: string
      isVerified: boolean
      cleaner?: {
        id: string
        userId: string
        experience: string
        serviceArea: string
        rating: number
        totalJobs: number
        isAvailable: boolean
        bio: string
        createdAt: Date
        updatedAt: Date
      }
      wallet?: {
        id: string
        userId: string
        balance: number
        currency: string
        isActive: boolean
        createdAt: Date
        updatedAt: Date
      }
    }
  }

  interface User {
    id: string
    email: string
    name: string
    role: string
    phone: string
    avatar: string
    isVerified: boolean
    cleaner?: {
      id: string
      userId: string
      experience: string
      serviceArea: string
      rating: number
      totalJobs: number
      isAvailable: boolean
      bio: string
      createdAt: Date
      updatedAt: Date
    }
    wallet?: {
      id: string
      userId: string
      balance: number
      currency: string
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    isVerified: boolean
    cleaner?: {
      id: string
      userId: string
      experience: string
      serviceArea: string
      rating: number
      totalJobs: number
      isAvailable: boolean
      bio: string
      createdAt: Date
      updatedAt: Date
    }
    wallet?: {
      id: string
      userId: string
      balance: number
      currency: string
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }
  }
}