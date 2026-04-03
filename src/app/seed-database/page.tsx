'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Loader2, CheckCircle, AlertCircle, Database, RefreshCw } from 'lucide-react'

interface DatabaseStatus {
  success: boolean
  message: string
  tables?: {
    users: number
    cleaners: number
    tanks: number
    qrCodes: number
    cleaningRequests: number
    cleaningRecords: number
    payments: number
    subscriptions: number
    feedback: number
    earnings: number
    wallets: number
    transactions: number
  }
  status: 'checked' | 'completed' | 'error'
  isEmpty?: boolean
  databaseConfigured?: boolean
  error?: string
  instructions?: any
}

export default function SeedDatabasePage() {
  const [status, setStatus] = useState<DatabaseStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [seeding, setSeeding] = useState(false)

  // Check database status on page load
  useEffect(() => {
    checkDatabaseStatus()
  }, [])

  const checkDatabaseStatus = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/seed-database')
      const data = await response.json()
      setStatus(data)
    } catch (error) {
      setStatus({
        success: false,
        message: 'Failed to check database status',
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setLoading(false)
    }
  }

  const seedDatabase = async () => {
    setSeeding(true)
    try {
      const response = await fetch('/api/seed-database', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()
      setStatus(data)
    } catch (error) {
      setStatus({
        success: false,
        message: 'Failed to seed database',
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setSeeding(false)
    }
  }

  const getStatusIcon = () => {
    if (loading || seeding) return <Loader2 className="h-4 w-4 animate-spin" />
    if (!status) return <Database className="h-4 w-4" />
    if (status.success) return <CheckCircle className="h-4 w-4 text-green-500" />
    return <AlertCircle className="h-4 w-4 text-red-500" />
  }

  const getStatusColor = () => {
    if (loading || seeding) return 'default'
    if (!status) return 'secondary'
    if (status.success) return 'default'
    return 'destructive'
  }

  const getDemoAccounts = () => [
    { email: 'admin@qrtanki.com', password: 'Admin@123', role: 'Admin' },
    { email: 'cleaner@qrtanki.com', password: 'Cleaner@123', role: 'Cleaner' },
    { email: 'user@qrtanki.com', password: 'User@123', role: 'User' },
    { email: 'society@qrtanki.com', password: 'Society@123', role: 'Society Manager' },
    { email: 'emergency@qrtanki.com', password: 'Emergency@123', role: 'Emergency User' },
    { email: 'wallet@qrtanki.com', password: 'Wallet@123', role: 'Wallet User' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🌱 Database Management
          </h1>
          <p className="text-gray-600">
            Manage your QR Tanki database with mobile-friendly controls
          </p>
        </div>

        {/* Status Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon()}
              Database Status
            </CardTitle>
            <CardDescription>
              Current status of your QR Tanki database
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Checking database status...</span>
              </div>
            ) : status ? (
              <div className="space-y-4">
                <Alert className={status.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                  <AlertDescription className="flex items-center gap-2">
                    {status.success ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                    {status.message}
                  </AlertDescription>
                </Alert>

                {status.tables && (
                  <div>
                    <h3 className="font-semibold mb-2">Database Tables:</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {Object.entries(status.tables).map(([table, count]) => (
                        <div key={table} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm capitalize">{table.replace(/([A-Z])/g, ' $1').trim()}</span>
                          <Badge variant={count > 0 ? 'default' : 'secondary'}>
                            {count}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {status.instructions && (
                  <Alert className="border-yellow-200 bg-yellow-50">
                    <AlertDescription>
                      <div className="space-y-2">
                        <p className="font-semibold">Setup Instructions:</p>
                        <ol className="list-decimal list-inside space-y-1 text-sm">
                          {Object.entries(status.instructions).map(([step, instruction]) => (
                            <li key={step}>{instruction}</li>
                          ))}
                        </ol>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Database className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No status available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Database Actions</CardTitle>
              <CardDescription>
                Perform database operations with mobile-friendly controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={checkDatabaseStatus}
                  disabled={loading || seeding}
                  variant="outline"
                  className="flex-1"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Check Status
                </Button>
                <Button
                  onClick={seedDatabase}
                  disabled={loading || seeding || (status?.isEmpty === false)}
                  className="flex-1"
                >
                  {seeding ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Seeding...
                    </>
                  ) : (
                    <>
                      <Database className="h-4 w-4 mr-2" />
                      Seed Database
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Demo Accounts */}
          <Card>
            <CardHeader>
              <CardTitle>Demo Accounts</CardTitle>
              <CardDescription>
                Use these accounts to test the QR Tanki platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {getDemoAccounts().map((account, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium">{account.email}</span>
                      <Badge variant="outline">{account.role}</Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      Password: <code className="bg-white px-1 rounded">{account.password}</code>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
            <CardDescription>
              Navigate to other pages quickly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" asChild className="w-full">
                <a href="/demo">🎯 Demo Page</a>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <a href="/dashboard">📊 Dashboard</a>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <a href="/auth/signin">🔐 Login</a>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <a href="/">🏠 Home</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}