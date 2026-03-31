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
  Calendar, 
  Users, 
  DollarSign, 
  Star, 
  Bell,
  Settings,
  LogOut,
  Home,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  TrendingUp,
  AlertCircle
} from "lucide-react"
import Link from "next/link"
import { signOut } from "next-auth/react"

interface CleaningTask {
  id: string
  tank: {
    name: string
    type: string
    location: string
    user: {
      name: string
      phone: string
    }
  }
  cleaningType: string
  scheduledDate: string
  preferredTime: string
  status: string
  urgencyLevel: number
  notes?: string
}

interface Earning {
  id: string
  amount: number
  netAmount: number
  earnedAt: string
  isPaid: boolean
  request: {
    tank: {
      name: string
    }
  }
}

export default function CleanerDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [tasks, setTasks] = useState<CleaningTask[]>([])
  const [earnings, setEarnings] = useState<Earning[]>([])
  const [cleanerProfile, setCleanerProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "loading") return
    
    if (!session) {
      router.push('/auth/signin')
      return
    }

    if (session.user.role !== 'CLEANER') {
      router.push(session.user.role === 'ADMIN' ? '/admin' : '/dashboard')
      return
    }

    // Load cleaner data
    loadCleanerData()
  }, [session, status, router])

  const loadCleanerData = async () => {
    try {
      // Load profile immediately
      setCleanerProfile({
        id: "1",
        experience: "5 years",
        serviceArea: "Mumbai, Pune, Thane",
        rating: 4.5,
        totalJobs: 150,
        isAvailable: true,
        bio: "Professional tank cleaning specialist with expertise in water hygiene and safety.",
        user: {
          name: "Amit Kumar",
          phone: "+91 98765 43211"
        }
      })

      // Load tasks immediately
      setTasks([
        {
          id: "1",
          tank: {
            name: "Main Water Tank",
            type: "Overhead",
            location: "Rooftop - Building A",
            user: {
              name: "Rahul Sharma",
              phone: "+91 98765 43210"
            }
          },
          cleaningType: "BASIC",
          scheduledDate: "2024-01-25",
          preferredTime: "10:00 AM",
          status: "ASSIGNED",
          urgencyLevel: 3,
          notes: "Customer prefers morning cleaning"
        },
        {
          id: "2",
          tank: {
            name: "Backup Tank",
            type: "Underground",
            location: "Backyard",
            user: {
              name: "Priya Patel",
              phone: "+91 98765 43213"
            }
          },
          cleaningType: "DEEP",
          scheduledDate: "2024-01-26",
          preferredTime: "2:00 PM",
          status: "PENDING",
          urgencyLevel: 2,
          notes: "Deep cleaning required, tank hasn't been cleaned in 6 months"
        }
      ])

      // Load earnings immediately
      setEarnings([
        {
          id: "1",
          amount: 300,
          netAmount: 240,
          earnedAt: "2024-01-15",
          isPaid: true,
          request: {
            tank: {
              name: "Main Water Tank"
            }
          }
        },
        {
          id: "2",
          amount: 500,
          netAmount: 400,
          earnedAt: "2024-01-10",
          isPaid: true,
          request: {
            tank: {
              name: "Society Tank"
            }
          }
        },
        {
          id: "3",
          amount: 350,
          netAmount: 280,
          earnedAt: "2024-01-05",
          isPaid: false,
          request: {
            tank: {
              name: "Office Tank"
            }
          }
        }
      ])
    } catch (error) {
      console.error("Failed to load cleaner data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      // Update local state
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      ))
      
      // In production, make API call
      // await fetch(`/api/cleaner/tasks/${taskId}`, { method: 'PATCH', body: JSON.stringify({ status: newStatus }) })
    } catch (error) {
      console.error("Failed to update task status:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'secondary'
      case 'ASSIGNED': return 'default'
      case 'IN_PROGRESS': return 'default'
      case 'COMPLETED': return 'default'
      default: return 'secondary'
    }
  }

  const getUrgencyColor = (level: number) => {
    if (level >= 4) return 'destructive'
    if (level >= 3) return 'default'
    return 'secondary'
  }

  const calculateTotalEarnings = () => {
    return earnings.reduce((total, earning) => total + earning.netAmount, 0)
  }

  const calculatePendingEarnings = () => {
    return earnings
      .filter(e => !e.isPaid)
      .reduce((total, earning) => total + earning.netAmount, 0)
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session || !cleanerProfile) {
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
                <span className="text-xl font-bold text-gray-900">QR Tanki</span>
              </Link>
              <nav className="hidden md:flex items-center space-x-6">
                <Link href="/cleaner" className="text-blue-600 font-medium">Dashboard</Link>
                <Link href="/cleaner/tasks" className="text-gray-600 hover:text-gray-900">My Tasks</Link>
                <Link href="/cleaner/earnings" className="text-gray-600 hover:text-gray-900">Earnings</Link>
                <Link href="/cleaner/profile" className="text-gray-600 hover:text-gray-900">Profile</Link>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">
                    {cleanerProfile.user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium">{cleanerProfile.user.name}</span>
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
            Welcome back, {cleanerProfile.user.name}!
          </h1>
          <p className="text-gray-600">
            Manage your cleaning tasks and track your earnings
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tasks.filter(t => t.status !== 'COMPLETED').length}</div>
              <p className="text-xs text-muted-foreground">
                {tasks.filter(t => t.status === 'PENDING').length} pending
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{calculateTotalEarnings()}</div>
              <p className="text-xs text-muted-foreground">
                ₹{calculatePendingEarnings()} pending
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cleanerProfile.rating}</div>
              <p className="text-xs text-muted-foreground">
                {cleanerProfile.totalJobs} jobs completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Availability</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {cleanerProfile.isAvailable ? 'Active' : 'Inactive'}
              </div>
              <p className="text-xs text-muted-foreground">
                {cleanerProfile.serviceArea}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tasks">My Tasks</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Today's Schedule */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Schedule</CardTitle>
                <CardDescription>
                  Your cleaning tasks for today
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tasks
                    .filter(task => task.scheduledDate === new Date().toISOString().split('T')[0])
                    .map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Droplets className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">{task.tank.name}</h4>
                            <p className="text-sm text-gray-600">
                              {task.tank.type} • {task.cleaningType} • {task.preferredTime}
                            </p>
                            <p className="text-sm text-gray-500">
                              {task.tank.user.name} • {task.tank.location}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={getStatusColor(task.status)}>
                            {task.status}
                          </Badge>
                          <div className="mt-2 space-x-2">
                            {task.status === 'ASSIGNED' && (
                              <Button size="sm" onClick={() => updateTaskStatus(task.id, 'IN_PROGRESS')}>
                                Start
                              </Button>
                            )}
                            {task.status === 'IN_PROGRESS' && (
                              <Button size="sm" onClick={() => updateTaskStatus(task.id, 'COMPLETED')}>
                                Complete
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  {tasks.filter(task => task.scheduledDate === new Date().toISOString().split('T')[0]).length === 0 && (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No tasks scheduled for today</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your latest completed jobs and earnings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {earnings.slice(0, 3).map((earning) => (
                    <div key={earning.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          earning.isPaid ? 'bg-green-100' : 'bg-yellow-100'
                        }`}>
                          {earning.isPaid ? (
                            <DollarSign className="w-5 h-5 text-green-600" />
                          ) : (
                            <Clock className="w-5 h-5 text-yellow-600" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium">{earning.request.tank.name}</h4>
                          <p className="text-sm text-gray-600">
                            Completed on {new Date(earning.earnedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">₹{earning.netAmount}</div>
                        <Badge variant={earning.isPaid ? "default" : "secondary"}>
                          {earning.isPaid ? "Paid" : "Pending"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Link href="/cleaner/earnings">
                    <Button variant="outline" className="w-full">
                      View All Earnings
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Tasks</h2>
              <Button>
                <Calendar className="w-4 h-4 mr-2" />
                View Calendar
              </Button>
            </div>

            <div className="grid gap-4">
              {tasks.map((task) => (
                <Card key={task.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Droplets className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{task.tank.name}</h3>
                          <p className="text-sm text-gray-600">{task.tank.type} Cleaning</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-sm text-gray-500 flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(task.scheduledDate).toLocaleDateString()}
                            </span>
                            <span className="text-sm text-gray-500 flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {task.preferredTime}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="space-y-2">
                          <Badge variant={getStatusColor(task.status)}>
                            {task.status}
                          </Badge>
                          <Badge variant={getUrgencyColor(task.urgencyLevel)}>
                            Urgency: {task.urgencyLevel}/5
                          </Badge>
                        </div>
                        
                        <div className="mt-3 space-x-2">
                          {task.status === 'PENDING' && (
                            <Button size="sm" onClick={() => updateTaskStatus(task.id, 'ASSIGNED')}>
                              Accept
                            </Button>
                          )}
                          {task.status === 'ASSIGNED' && (
                            <Button size="sm" onClick={() => updateTaskStatus(task.id, 'IN_PROGRESS')}>
                              Start
                            </Button>
                          )}
                          {task.status === 'IN_PROGRESS' && (
                            <Button size="sm" onClick={() => updateTaskStatus(task.id, 'COMPLETED')}>
                              Complete
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t">
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Customer:</span> {task.tank.user.name}
                        </div>
                        <div>
                          <span className="font-medium">Phone:</span> 
                          <a href={`tel:${task.tank.user.phone}`} className="text-blue-600 hover:underline ml-1">
                            {task.tank.user.phone}
                          </a>
                        </div>
                        <div>
                          <span className="font-medium">Location:</span> {task.tank.location}
                        </div>
                        <div>
                          <span className="font-medium">Type:</span> {task.cleaningType}
                        </div>
                      </div>
                      {task.notes && (
                        <div className="mt-2">
                          <span className="font-medium text-sm">Notes:</span>
                          <p className="text-sm text-gray-600 mt-1">{task.notes}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="earnings" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Earnings</h2>
              <div className="text-right">
                <div className="text-sm text-gray-600">Total Earned</div>
                <div className="text-2xl font-bold">₹{calculateTotalEarnings()}</div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹1,200</div>
                  <p className="text-xs text-muted-foreground">+15% from last month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Pending</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{calculatePendingEarnings()}</div>
                  <p className="text-xs text-muted-foreground">Awaiting payment</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Avg per Job</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{Math.round(calculateTotalEarnings() / earnings.length)}</div>
                  <p className="text-xs text-muted-foreground">After commission</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Earning History</CardTitle>
                <CardDescription>
                  Your complete earning records
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {earnings.map((earning) => (
                    <div key={earning.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          earning.isPaid ? 'bg-green-100' : 'bg-yellow-100'
                        }`}>
                          {earning.isPaid ? (
                            <DollarSign className="w-5 h-5 text-green-600" />
                          ) : (
                            <Clock className="w-5 h-5 text-yellow-600" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium">{earning.request.tank.name}</h4>
                          <p className="text-sm text-gray-600">
                            {new Date(earning.earnedAt).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                          <p className="text-sm text-gray-500">
                            Gross: ₹{earning.amount} → Net: ₹{earning.netAmount} (20% commission)
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-lg">₹{earning.netAmount}</div>
                        <Badge variant={earning.isPaid ? "default" : "secondary"}>
                          {earning.isPaid ? "Paid" : "Pending"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}