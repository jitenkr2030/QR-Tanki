// NextAuth API Route Handler - Production Safe
// Compatible with Vercel build and production deployment

import NextAuth from "next-auth"
import authOptions from "@/lib/auth"

// Create the handler without destructuring to avoid build issues
const handler = NextAuth(authOptions)

// Export methods individually to avoid undefined GET error
export async function GET(request: Request) {
  return handler(request)
}

export async function POST(request: Request) {
  return handler(request)
}