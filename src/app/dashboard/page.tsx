'use client'

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Droplets, 
  QrCode, 
  Calendar, 
  Plus, 
  History, 
  Settings,
  LogOut,
  Home,
  CreditCard,
  Shield,
  Star,
  Clock,
  CheckCircle,
  AlertTriangle,
  Wifi,
  WifiOff,
  RefreshCw
} from "lucide-react"
import Link from "next/link"
import { signOut } from "next-auth/react"
import { NotificationCenter } from "@/components/notifications"
import { MobileNav } from "@/components/mobile-nav"
import { OfflineStatusIndicator } from "@/components/offline-status-indicator"
import { ProfileDropdown } from "@/components/profile-dropdown"
import { useOffline, useCachedData } from "@/lib/offline/hooks"
import { localStorageCache } from "@/lib/offline/storage"

interface Tank {
  id: string
  name: string
  type: string
  capacity?: string
  location: string
  lastCleanedDate?: string
  nextDueDate?: string
  hygieneScore?: number
  qrCode: {
    code: string
    isPaid: boolean
  }
}

interface CleaningRecord {
  id: string
  cleaningType: string
  cleanedAt: string
  hygieneScore?: number
  cleaner: {
    user: {
      name: string
    }
  }
}

interface DashboardStats {
  totalTanks: number
  cleaningsThisMonth: number
  cleaningsLastMonth: number
  avgHygieneScore: number
  nextCleaningDue: number | null
  nextCleaningDueTank: string | null
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { isOnline, isOffline, syncData } = useOffline()
  const [tanks, setTanks] = useState<Tank[]>([])
  const [cleaningHistory, setCleaningHistory] = useState<CleaningRecord[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch real tanks data
  const { 
    data: cachedTanks, 
    isLoading: tanksLoading, 
    error: tanksError,
    refresh: refreshTanks 
  } = useCachedData<Tank[]>(
    'dashboard-tanks',
    async () => {
      try {
        const response = await fetch('/api/dashboard/tanks')
        if (!response.ok) {
          throw new Error('Failed to fetch tanks')
        }
        return await response.json()
      } catch (error) {
        console.error('Error fetching tanks:', error)
        return [] // Return empty array on error
      }
    }
  )

  // Fetch dashboard stats
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats')
      if (!response.ok) {
        throw new Error('Failed to fetch stats')
      }
      const statsData = await response.json()
      setStats(statsData)
    } catch (error) {
      console.error('Error fetching stats:', error)
      // Set default stats on error
      setStats({
        totalTanks: 0,
        cleaningsThisMonth: 0,
        cleaningsLastMonth: 0,
        avgHygieneScore: 0,
        nextCleaningDue: null,
        nextCleaningDueTank: null
      })
    }
  }

  // Fetch real cleaning history
  const { 
    data: cachedHistory, 
    isLoading: historyLoading, 
    refresh: refreshHistory 
  } = useCachedData<CleaningRecord[]>(
    'dashboard-history',
    async () => {
      try {
        const response = await fetch('/api/dashboard/history')
        if (!response.ok) {
          throw new Error('Failed to fetch cleaning history')
        }
        return await response.json()
      } catch (error) {
        console.error('Error fetching cleaning history:', error)
        return [] // Return empty array on error
      }
    }
  )

  useEffect(() => {
    if (status === "loading") return
    
    if (!session) {
      router.push('/auth/signin')
      return
    }

    if (session.user.role !== 'USER') {
      router.push(session.user.role === 'ADMIN' ? '/admin' : '/cleaner')
      return
    }

    // Update state with cached data
    setTanks(cachedTanks || [])
    setCleaningHistory(cachedHistory || [])
    await fetchStats()
    setLoading(false)
  }, [session, status, router, cachedTanks, cachedHistory])

  // Handle manual refresh
  const handleRefresh = async () => {
    setLoading(true)
    try {
      await refreshTanks()
      await refreshHistory()
      await fetchStats()
      // Update state with fresh data
      setTanks(cachedTanks || [])
      setCleaningHistory(cachedHistory || [])
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50 safe-area-padding">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Droplets className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900 hidden sm:block">QR Tanki</span>
                <span className="text-lg font-bold text-gray-900 sm:hidden">QT</span>
              </Link>
              <nav className="hidden md:flex items-center space-x-6">
                <Link href="/dashboard" className="text-blue-600 font-medium">Dashboard</Link>
                <Link href="/tanks" className="text-gray-600 hover:text-gray-900">My Tanks</Link>
                <Link href="/bookings" className="text-gray-600 hover:text-gray-900">Bookings</Link>
                <Link href="/subscriptions" className="text-gray-600 hover:text-gray-900">Subscriptions</Link>
              </nav>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <MobileNav userId={session.user.id} />
              <NotificationCenter userId={session.user.id} />
              <OfflineStatusIndicator />
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                <Settings className="w-4 h-4" />
              </Button>
              
              {/* Profile Dropdown */}
              <ProfileDropdown 
                userName={session.user.name}
                userEmail={session.user.email}
                userRole={session.user.role}
              />
              
              <Button variant="ghost" size="sm" className="hidden sm:flex" onClick={handleSignOut}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Offline Notification */}
        {isOffline && (
          <Alert className="mb-6 border-orange-200 bg-orange-50">
            <WifiOff className="h-4 w-4" />
            <AlertDescription>
              <div className="flex items-center justify-between">
                <div>
                  <strong>You're offline</strong>
                  <span className="ml-2">Some features may not be available. Your data will be saved locally and synced when you're back online.</span>
                </div>
                <Button size="sm" onClick={syncData} disabled={!isOnline}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Sync Now
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {session.user.name}!
              </h1>
              <p className="text-gray-600">
                Manage your water tanks and track cleaning history
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          <Card className="col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tanks</CardTitle>
              <Droplets className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalTanks || 0}</div>
              <p className="text-xs text-muted-foreground">
                Registered tanks
              </p>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cleanings This Month</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.cleaningsThisMonth || 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats && stats.cleaningsLastMonth > 0 ? `+${stats.cleaningsThisMonth - stats.cleaningsLastMonth} from last month` : 'No previous data'}
              </p>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Hygiene Score</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.avgHygieneScore || 'N/A'}</div>
              <p className="text-xs text-muted-foreground">
                {stats && stats.avgHygieneScore >= 4 ? 'Good condition' : stats && stats.avgHygieneScore > 0 ? 'Needs improvement' : 'No data'}
              </p>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Cleaning Due</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.nextCleaningDue ? `${stats.nextCleaningDue} days` : 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats?.nextCleaningDueTank || 'No scheduled cleanings'}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tanks">My Tanks</TabsTrigger>
            <TabsTrigger value="history">Cleaning History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <QrCode className="w-5 h-5 mr-2" />
                    Generate QR Code
                  </CardTitle>
                  <CardDescription>
                    Add a new tank and generate QR code
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/tanks/new">
                    <Button className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Tank
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Book Cleaning
                  </CardTitle>
                  <CardDescription>
                    Schedule a cleaning service
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/bookings/new">
                    <Button className="w-full" variant="outline">
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Now
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Subscription
                  </CardTitle>
                  <CardDescription>
                    Manage your cleaning plans
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/subscriptions">
                    <Button className="w-full" variant="outline">
                      <CreditCard className="w-4 h-4 mr-2" />
                      View Plans
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Recent Tanks */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Tanks</CardTitle>
                <CardDescription>
                  Your registered water tanks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tanks.length > 0 ? (
                    tanks.slice(0, 3).map((tank) => (
                      <div key={tank.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Droplets className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">{tank.name}</h4>
                            <p className="text-sm text-gray-600">{tank.type} • {tank.capacity}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge 
                            variant={tank.hygieneScore && tank.hygieneScore >= 4 ? "default" : "secondary"}
                            className="mb-2"
                          >
                            Score: {tank.hygieneScore || 'N/A'}
                          </Badge>
                          <p className="text-sm text-gray-600">
                            Due: {tank.nextDueDate || 'Not scheduled'}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Droplets className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No tanks registered</h3>
                      <p className="text-gray-600 mb-4">Get started by adding your first water tank</p>
                      <Link href="/tanks/new">
                        <Button>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Your First Tank
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
                {tanks.length > 0 && (
                  <div className="mt-4">
                    <Link href="/tanks">
                      <Button variant="outline" className="w-full">
                        View All Tanks
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tanks" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Tanks</h2>
              <Link href="/tanks/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Tank
                </Button>
              </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {tanks.length > 0 ? (
                tanks.map((tank) => (
                  <Card key={tank.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{tank.name}</CardTitle>
                        <Badge variant={tank.qrCode.isPaid ? "default" : "secondary"}>
                          {tank.qrCode.isPaid ? "Active" : "Payment Pending"}
                        </Badge>
                      </div>
                      <CardDescription>
                        {tank.type} • {tank.capacity}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Location:</span>
                          <span>{tank.location}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">QR Code:</span>
                          <span className="font-mono">{tank.qrCode.code}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Last Cleaned:</span>
                          <span>{tank.lastCleanedDate || 'Never'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Next Due:</span>
                          <span className={tank.nextDueDate ? "text-orange-600" : "text-gray-500"}>
                            {tank.nextDueDate || 'Not scheduled'}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Hygiene Score:</span>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-500 mr-1" />
                            <span>{tank.hygieneScore || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1" asChild>
                          <Link href={`/tanks/${tank.id}`}>
                            View Details
                          </Link>
                        </Button>
                        <Button size="sm" className="flex-1" asChild>
                          <Link href={`/bookings/new?tankId=${tank.id}`}>
                            Book Cleaning
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-2 text-center py-12">
                  <Droplets className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No tanks registered yet</h3>
                  <p className="text-gray-600 mb-6">Add your first water tank to start tracking cleaning schedules</p>
                  <Link href="/tanks/new">
                    <Button size="lg">
                      <Plus className="w-5 h-5 mr-2" />
                      Add Your First Tank
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cleaning History</CardTitle>
                <CardDescription>
                  Track all your tank cleaning records
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cleaningHistory.length > 0 ? (
                    cleaningHistory.map((record) => (
                      <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">{record.cleaningType} Cleaning</h4>
                            <p className="text-sm text-gray-600">
                              By {record.cleaner.user.name} • {record.cleanedAt}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-500 mr-1" />
                            <span className="font-medium">{record.hygieneScore}</span>
                          </div>
                          <p className="text-sm text-gray-600">Hygiene Score</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No cleaning history</h3>
                      <p className="text-gray-600">Your tank cleaning records will appear here once you schedule your first cleaning</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}