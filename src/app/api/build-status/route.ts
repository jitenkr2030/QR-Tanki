// Build Status API Route
// GET /api/build-status

import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const buildTime = new Date().toISOString()
    const nodeEnv = process.env.NODE_ENV || 'development'
    const databaseUrl = process.env.DATABASE_URL ? 'configured' : 'not configured'
    
    return NextResponse.json({
      status: 'success',
      buildTime,
      environment: nodeEnv,
      database: {
        configured: databaseUrl === 'configured',
        url: databaseUrl === 'configured' ? '***hidden***' : null
      },
      features: {
        auth: process.env.NEXTAUTH_SECRET ? 'configured' : 'not configured',
        nextAuthUrl: process.env.NEXTAUTH_URL || 'not configured'
      },
      message: 'QR Tanki build status'
    })
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error',
        message: 'Failed to get build status',
        error: error.message 
      },
      { status: 500 }
    )
  }
}