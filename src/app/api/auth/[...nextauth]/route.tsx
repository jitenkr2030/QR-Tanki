// Fixed NextAuth API Route Handler
// Compatible with Vercel build and Turbopack

import NextAuth from "next-auth"
import authOptions from "@/lib/auth"

// Create the NextAuth handler
const handler = NextAuth(authOptions)

// Export the handlers properly for Vercel and Turbopack
export const GET = handler
export const POST = handler

// Also export as default for compatibility
export default handler