'use client'

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Calendar, 
  Plus, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  Star, 
  MapPin, 
  User, 
  Phone,
  Eye,
  ArrowLeft,
  Filter,
  Droplets,
  Settings
} from "lucide-react"
import { signOut } from "next-auth/react"
import { NotificationCenter } from "@/components/notifications"
import { MobileNav } from "@/components/mobile-nav"

interface Booking {
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
  createdAt: string
  cleaner?: {
    user: {
      name: string
    }
  }
  cleaningRecord?: {
    id: string
    cleanedAt: string
    hygieneScore: number
  }
  payment?: {
    amount: number
    status: string
  }
}

export default function BookingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

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

    loadBookings()
  }, [session, status, router])

  const loadBookings = async () => {
    try {
      const response = await fetch('/api/bookings')
      const result = await response.json()
      
      if (response.ok) {
        setBookings(result.bookings)
      }
    } catch (error) {
      console.error("Failed to load bookings:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'secondary'
      case 'ASSIGNED': return 'default'
      case 'IN_PROGRESS': return 'default'
      case 'COMPLETED': return 'default'
      case 'CANCELLED': return 'destructive'
      default: return 'secondary'
    }
  }

  const getUrgencyColor = (level: number) => {
    if (level >= 4) return 'destructive'
    if (level >= 3) return 'default'
    return 'secondary'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timeString: string) => {
    return timeString || 'Not specified'
  }

  const getCleaningPrice = (type: string) => {
    switch (type) {
      case 'BASIC': return 699
      case 'DEEP': return 899
      case 'EMERGENCY': return 1299
      default: return 0
    }
  }

  const filteredBookings = bookings.filter(booking => 
    booking.status !== 'CANCELLED'
  )

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
              <Link href="/dashboard" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Droplets className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900 hidden sm:block">QR Tanki</span>
                <span className="text-lg font-bold text-gray-900 sm:hidden">QT</span>
              </Link>
              <nav className="hidden md:flex items-center space-x-6">
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
                <Link href="/tanks" className="text-gray-600 hover:text-gray-900">My Tanks</Link>
                <Link href="/bookings" className="text-blue-600 font-medium">Bookings</Link>
                <Link href="/subscriptions" className="text-gray-600 hover:text-gray-900">Subscriptions</Link>
              </nav>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <MobileNav userId={session.user.id} />
              <NotificationCenter userId={session.user.id} />
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                <Settings className="w-4 h-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">
                    {session.user.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium hidden sm:block">{session.user.name}</span>
              </div>
              <Button variant="ghost" size="sm" className="hidden sm:flex" onClick={handleSignOut}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              My Bookings
            </h1>
            <p className="text-gray-600">
              Track your cleaning service bookings and schedules
            </p>
          </div>
          <Link href="/bookings/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Book Cleaning
            </Button>
          </Link>
        </div>

        {filteredBookings.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No bookings yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Book your first cleaning service to start managing your tank maintenance.
                </p>
                <Link href="/bookings/new">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Book Your First Cleaning
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Tabs defaultValue="all" className="space-y-6">
              <TabsList>
                <TabsTrigger value="all">All Bookings</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-6">
                <div className="grid gap-6">
                  {filteredBookings.map((booking) => (
                    <Card key={booking.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Calendar className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {booking.tank.name}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {booking.tank.type} • {booking.cleaningType}
                              </p>
                              <div className="flex items-center space-x-4 mt-1">
                                <span className="text-sm text-gray-500 flex items-center">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  {booking.tank.location}
                                </span>
                                <span className="text-sm text-gray-500 flex items-center">
                                  <User className="w-3 h-3 mr-1" />
                                  {booking.tank.user.name}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="space-y-2">
                              <Badge variant={getStatusColor(booking.status)}>
                                {booking.status}
                              </Badge>
                              <Badge variant={getUrgencyColor(booking.urgencyLevel)}>
                                Urgency: {booking.urgencyLevel}/5
                              </Badge>
                            </div>
                            
                            {booking.payment && (
                              <div className="text-right">
                                <div className="font-medium">₹{getCleaningPrice(booking.cleaningType)}</div>
                                <Badge variant={booking.payment.status === 'COMPLETED' ? "default" : "secondary"}>
                                  {booking.payment.status}
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-6 mt-6 pt-6 border-t">
                          <div className="space-y-4 text-sm">
                            <div>
                              <span className="font-medium">Scheduled Date:</span>
                              <p>{formatDate(booking.scheduledDate)}</p>
                            </div>
                            <div>
                              <span className="font-medium">Preferred Time:</span>
                              <p>{formatTime(booking.preferredTime)}</p>
                            </div>
                            <div>
                              <span className="font-medium">Customer:</span>
                              <p>{booking.tank.user.name}</p>
                              {booking.tank.user.phone && (
                                <p className="text-blue-600">
                                  <a href={`tel:${booking.tank.user.phone}`} className="hover:underline">
                                    {booking.tank.user.phone}
                                  </a>
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div className="space-y-4 text-sm">
                            <div>
                              <span className="font-medium">Service Type:</span>
                              <p>{booking.cleaningType}</p>
                            </div>
                            <div>
                              <span className="font-medium">Booked On:</span>
                              <p>{formatDate(booking.createdAt)}</p>
                            </div>
                            {booking.cleaner && (
                              <div>
                                <span className="font-medium">Assigned Cleaner:</span>
                                <p>{booking.cleaner.user.name}</p>
                              </div>
                            )}
                            {booking.notes && (
                              <div>
                                <span className="font-medium">Notes:</span>
                                <p className="text-gray-600">{booking.notes}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {booking.cleaningRecord && (
                          <div className="mt-6 pt-6 border-t">
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                              <h4 className="font-medium text-green-900 mb-2">Cleaning Completed</h4>
                              <div className="grid md:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-green-700">Completed On:</span>
                                  <p className="text-green-900 font-medium">
                                    {formatDate(booking.cleaningRecord.cleanedAt)}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-green-700">Hygiene Score:</span>
                                  <div className="flex items-center">
                                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                                    <span className="text-green-900 font-medium">
                                      {booking.cleaningRecord.hygieneScore}/5
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-6 pt-6 border-t">
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" asChild>
                              <Link href={`/bookings/${booking.id}`}>
                                <Eye className="w-4 h-4" />
                              </Link>
                            </Button>
                            {booking.status === 'PENDING' && (
                              <Button size="sm" variant="outline">
                                Cancel
                              </Button>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">
                              Booking ID: {booking.id.slice(0, 8)}...
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="upcoming" className="space-y-6">
                <div className="grid gap-6">
                  {filteredBookings
                    .filter(booking => ['PENDING', 'ASSIGNED', 'IN_PROGRESS'].includes(booking.status))
                    .map((booking) => (
                      <Card key={booking.id}>
                        <CardContent className="pt-6">
                          {/* Same content as above but filtered for upcoming */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">
                                  {booking.tank.name}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {booking.tank.type} • {booking.cleaningType}
                                </p>
                              </div>
                            </div>
                            <Badge variant={getStatusColor(booking.status)}>
                              {booking.status}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="completed" className="space-y-6">
                <div className="grid gap-6">
                  {filteredBookings
                    .filter(booking => booking.status === 'COMPLETED')
                    .map((booking) => (
                      <Card key={booking.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">
                                  {booking.tank.name}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {booking.tank.type} • {booking.cleaningType}
                                </p>
                              </div>
                            </div>
                            <Badge variant="default">Completed</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="pending" className="space-y-6">
                <div className="grid gap-6">
                  {filteredBookings
                    .filter(booking => booking.status === 'PENDING')
                    .map((booking) => (
                      <Card key={booking.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <Clock className="w-6 h-6 text-yellow-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">
                                  {booking.tank.name}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {booking.tank.type} • {booking.cleaningType}
                                </p>
                              </div>
                            </div>
                            <Badge variant="secondary">Pending</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>
    </div>
  )
}