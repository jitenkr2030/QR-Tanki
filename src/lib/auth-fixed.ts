// Fixed Auth Configuration for Vercel Build
// Compatible with Next.js 16.1.3 and Turbopack

import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"

// Create a singleton PrismaClient instance
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient } | undefined

function getPrismaClient() {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient()
  }
  return globalForPrisma.prisma
}

const prisma = getPrismaClient()

// Create authOptions with proper structure
export const authOptions = {
  adapter: PrismaAdapter(prisma, {
    provider: "neon",
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

        try {
          // Get user from database
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email as string
            }
          })

          if (!user) {
            return null
          }

          // Demo passwords for testing
          const demoPasswords = {
            'admin@qrtanki.com': 'Admin@123',
            'cleaner@qrtanki.com': 'Cleaner@123',
            'user@qrtanki.com': 'User@123',
            'society@qrtanki.com': 'Society@123',
            'emergency@qrtanki.com': 'Emergency@123',
            'wallet@qrtanki.com': 'Wallet@123'
          }

          const isValidPassword = demoPasswords[user.email as string] === credentials.password

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
export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(authOptions)

// Also export as default for compatibility
export default authOptions