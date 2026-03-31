'use client'

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Droplets, 
  Users, 
  DollarSign, 
  Calendar, 
  TrendingUp,
  Settings,
  LogOut,
  Home,
  CheckCircle,
  AlertCircle,
  UserCheck,
  UserX,
  Star,
  MapPin,
  Phone,
  Eye,
  Edit,
  Trash2
} from "lucide-react"
import Link from "next/link"
import { signOut } from "next-auth/react"

interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: string
  isVerified: boolean
  createdAt: string
  _count: {
    tanks: number
    subscriptions: number
    cleaningRequests: number
  }
}

interface SystemStats {
  totalUsers: number
  totalCleaners: number
  totalTanks: number
  totalRevenue: number
  monthlyRevenue: number
  activeSubscriptions: number
  pendingRequests: number
  completedCleanings: number
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState<SystemStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "loading") return
    
    if (!session) {
      router.push('/auth/signin')
      return
    }

    if (session.user.role !== 'ADMIN') {
      router.push(session.user.role === 'CLEANER' ? '/cleaner' : '/dashboard')
      return
    }

    // Load admin data
    loadAdminData()
  }, [session, status, router])

  const loadAdminData = async () => {
    try {
      // Load stats immediately
      setStats({
        totalUsers: 150,
        totalCleaners: 25,
        totalTanks: 280,
        totalRevenue: 245000,
        monthlyRevenue: 45000,
        activeSubscriptions: 85,
        pendingRequests: 12,
        completedCleanings: 450
      })

      // Load users immediately
      setUsers([
        {
          id: "1",
          name: "Rahul Sharma",
          email: "rahul@example.com",
          phone: "+91 98765 43210",
          role: "USER",
          isVerified: true,
          createdAt: "2024-01-15",
          _count: {
            tanks: 2,
            subscriptions: 1,
            cleaningRequests: 5
          }
        },
        {
          id: "2",
          name: "Amit Kumar",
          email: "amit@example.com",
          phone: "+91 98765 43211",
          role: "CLEANER",
          isVerified: true,
          createdAt: "2024-01-10",
          _count: {
            tanks: 0,
            subscriptions: 0,
            cleaningRequests: 25
          }
        },
        {
          id: "3",
          name: "Priya Patel",
          email: "priya@example.com",
          phone: "+91 98765 43213",
          role: "USER",
          isVerified: false,
          createdAt: "2024-01-20",
          _count: {
            tanks: 1,
            subscriptions: 0,
            cleaningRequests: 2
          }
        }
      ])
    } catch (error) {
      console.error("Failed to load admin data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  const toggleUserVerification = async (userId: string) => {
    try {
      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, isVerified: !user.isVerified } : user
      ))
      
      // In production, make API call
      // await fetch(`/api/admin/users/${userId}/verify`, { method: 'PATCH' })
    } catch (error) {
      console.error("Failed to toggle user verification:", error)
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'default'
      case 'CLEANER': return 'secondary'
      case 'USER': return 'outline'
      default: return 'secondary'
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session || !stats) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Droplets className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">QR Tanki Admin</span>
              </Link>
              <nav className="hidden md:flex items-center space-x-6">
                <Link href="/admin" className="text-blue-600 font-medium">Dashboard</Link>
                <Link href="/admin/users" className="text-gray-600 hover:text-gray-900">Users</Link>
                <Link href="/admin/cleaners" className="text-gray-600 hover:text-gray-900">Cleaners</Link>
                <Link href="/admin/bookings" className="text-gray-600 hover:text-gray-900">Bookings</Link>
                <Link href="/admin/analytics" className="text-gray-600 hover:text-gray-900">Analytics</Link>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-red-600">A</span>
                </div>
                <span className="text-sm font-medium">Admin</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage users, monitor operations, and track platform performance
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalCleaners} cleaners
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tanks</CardTitle>
              <Droplets className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTanks}</div>
              <p className="text-xs text-muted-foreground">
                Registered tanks
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                ₹{stats.monthlyRevenue.toLocaleString()} this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeSubscriptions}</div>
              <p className="text-xs text-muted-foreground">
                {stats.pendingRequests} pending requests
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">New Users Today</span>
                      <span className="font-medium">5</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Cleanings Completed</span>
                      <span className="font-medium">12</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Revenue Today</span>
                      <span className="font-medium">₹3,500</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Pending Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Payment Verifications</span>
                      <Badge variant="secondary">3</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Cleaner Approvals</span>
                      <Badge variant="secondary">2</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Support Tickets</span>
                      <Badge variant="secondary">7</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">System Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Database Status</span>
                      <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">API Response</span>
                      <Badge className="bg-green-100 text-green-800">Normal</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Server Load</span>
                      <Badge className="bg-green-100 text-green-800">Low</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Users */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Users</CardTitle>
                  <Link href="/admin/users">
                    <Button variant="outline" size="sm">View All</Button>
                  </Link>
                </div>
                <CardDescription>
                  Latest user registrations on the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.slice(0, 5).map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium">{user.name}</h4>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant={getRoleColor(user.role)}>
                              {user.role}
                            </Badge>
                            {user.isVerified ? (
                              <Badge className="bg-green-100 text-green-800">
                                <UserCheck className="w-3 h-3 mr-1" />
                                Verified
                              </Badge>
                            ) : (
                              <Badge variant="secondary">
                                <UserX className="w-3 h-3 mr-1" />
                                Not Verified
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm text-gray-600">
                          {user._count.tanks} tanks
                        </div>
                        <div className="text-sm text-gray-600">
                          {user._count.subscriptions} subscriptions
                        </div>
                        <div className="mt-2 space-x-2">
                          <Button size="sm" variant="outline" onClick={() => toggleUserVerification(user.id)}>
                            {user.isVerified ? 'Unverify' : 'Verify'}
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">User Management</h2>
              <div className="flex space-x-2">
                <Button variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Export Users
                </Button>
                <Button>
                  <UserCheck className="w-4 h-4 mr-2" />
                  Add User
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-lg font-medium text-blue-600">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold">{user.name}</h3>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          {user.phone && (
                            <p className="text-sm text-gray-500 flex items-center">
                              <Phone className="w-3 h-3 mr-1" />
                              {user.phone}
                            </p>
                          )}
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant={getRoleColor(user.role)}>
                              {user.role}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              Joined {new Date(user.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                          <div>
                            <div className="font-medium">{user._count.tanks}</div>
                            <div className="text-gray-600">Tanks</div>
                          </div>
                          <div>
                            <div className="font-medium">{user._count.subscriptions}</div>
                            <div className="text-gray-600">Subs</div>
                          </div>
                          <div>
                            <div className="font-medium">{user._count.cleaningRequests}</div>
                            <div className="text-gray-600">Requests</div>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => toggleUserVerification(user.id)}>
                            {user.isVerified ? (
                              <><UserX className="w-4 h-4 mr-1" />Unverify</>
                            ) : (
                              <><UserCheck className="w-4 h-4 mr-1" />Verify</>
                            )}
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                  <CardDescription>
                    Monthly revenue breakdown
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>QR Code Sales</span>
                      <span className="font-medium">₹15,000</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Subscriptions</span>
                      <span className="font-medium">₹25,000</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>One-Time Services</span>
                      <span className="font-medium">₹5,000</span>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex items-center justify-between font-semibold">
                        <span>Total</span>
                        <span>₹45,000</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                  <CardDescription>
                    New user registrations over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>This Month</span>
                      <span className="font-medium">+25 users</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Last Month</span>
                      <span className="font-medium">+18 users</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Growth Rate</span>
                      <span className="font-medium text-green-600">+38.9%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Platform Performance</CardTitle>
                <CardDescription>
                  Key metrics and KPIs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold">4.2</div>
                    <div className="text-sm text-gray-600">Avg Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">92%</div>
                    <div className="text-sm text-gray-600">Satisfaction</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">24h</div>
                    <div className="text-sm text-gray-600">Avg Response</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">98%</div>
                    <div className="text-sm text-gray-600">Uptime</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}