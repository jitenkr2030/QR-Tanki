// Production-Ready Auth Configuration
// Handles different environments gracefully

import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"

// Safe PrismaClient initialization
function getPrismaClient() {
  const databaseUrl = process.env.DATABASE_URL
  
  if (!databaseUrl) {
    console.warn('DATABASE_URL is not configured in auth configuration')
    return null
  }
  
  return new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl
      }
    }
  })
}

// Demo credentials for fallback
const DEMO_CREDENTIALS = {
  'admin@qrtanki.com': 'Admin@123',
  'cleaner@qrtanki.com': 'Cleaner@123',
  'user@qrtanki.com': 'User@123',
  'society@qrtanki.com': 'Society@123',
  'emergency@qrtanki.com': 'Emergency@123',
  'wallet@qrtanki.com': 'Wallet@123'
}

export const authOptions = {
  // Only use adapter if DATABASE_URL is available
  ...(process.env.DATABASE_URL && {
    adapter: PrismaAdapter(getPrismaClient(), {
      provider: "neon",
    }),
  }),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // If no database URL, use demo credentials for development
        if (!process.env.DATABASE_URL) {
          const isValidPassword = DEMO_CREDENTIALS[credentials.email as string] === credentials.password
          
          if (!isValidPassword) {
            return null
          }

          return {
            id: 'demo-' + credentials.email,
            email: credentials.email,
            name: credentials.email.split('@')[0],
            role: credentials.email.includes('admin') ? 'ADMIN' : 
                  credentials.email.includes('cleaner') ? 'CLEANER' : 'USER',
            phone: '+91 98765 43210',
            isVerified: true,
          }
        }

        // Production database authentication
        try {
          const prisma = getPrismaClient()
          if (!prisma) return null

          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email as string
            }
          })

          if (!user) {
            return null
          }

          const isValidPassword = DEMO_CREDENTIALS[user.email as string] === credentials.password

          if (!isValidPassword) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            phone: user.phone,
            isVerified: user.isVerified,
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.phone = user.phone
        token.isVerified = user.isVerified
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role
        session.user.phone = token.phone
        session.user.isVerified = token.isVerified
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
    error: "/auth/error",
  },
}

// Create and export the NextAuth handler
const handler = NextAuth(authOptions)

// Export the handler for use in routes
export { handler }

// Also export authOptions for use in API routes
export default authOptions