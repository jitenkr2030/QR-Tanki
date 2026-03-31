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
  Droplets, 
  Plus, 
  QrCode, 
  Calendar, 
  Star, 
  MapPin, 
  Clock,
  Shield,
  AlertCircle,
  CheckCircle,
  Eye,
  Edit,
  Trash2,
  ArrowLeft,
  Settings
} from "lucide-react"
import { signOut } from "next-auth/react"
import { NotificationCenter } from "@/components/notifications"
import { MobileNav } from "@/components/mobile-nav"

interface Tank {
  id: string
  name: string
  type: string
  capacity?: string
  location: string
  installationDate?: string
  lastCleanedDate?: string
  nextDueDate?: string
  hygieneScore?: number
  isActive: boolean
  qrCode: {
    id: string
    code: string
    isPaid: boolean
    generatedAt: string
  }
  _count: {
    cleaningRecords: number
    cleaningRequests: number
  }
}

export default function TanksPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [tanks, setTanks] = useState<Tank[]>([])
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

    loadTanks()
  }, [session, status, router])

  const loadTanks = async () => {
    try {
      const response = await fetch('/api/tanks')
      const result = await response.json()
      
      if (response.ok) {
        setTanks(result.tanks)
      }
    } catch (error) {
      console.error("Failed to load tanks:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  const getHygieneScoreColor = (score?: number) => {
    if (!score) return "secondary"
    if (score >= 4.5) return "default"
    if (score >= 3.5) return "secondary"
    return "destructive"
  }

  const getHygieneScoreText = (score?: number) => {
    if (!score) return "Not Rated"
    if (score >= 4.5) return "Excellent"
    if (score >= 3.5) return "Good"
    if (score >= 2.5) return "Fair"
    return "Poor"
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not Set"
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getDaysRemaining = (dateString?: string) => {
    if (!dateString) return null
    const end = new Date(dateString)
    const now = new Date()
    const diffTime = end.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
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
              <Link href="/dashboard" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Droplets className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900 hidden sm:block">QR Tanki</span>
                <span className="text-lg font-bold text-gray-900 sm:hidden">QT</span>
              </Link>
              <nav className="hidden md:flex items-center space-x-6">
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
                <Link href="/tanks" className="text-blue-600 font-medium">My Tanks</Link>
                <Link href="/bookings" className="text-gray-600 hover:text-gray-900">Bookings</Link>
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
              My Tanks
            </h1>
            <p className="text-gray-600">
              Manage your water tanks and track cleaning history
            </p>
          </div>
          <Link href="/tanks/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Tank
            </Button>
          </Link>
        </div>

        {tanks.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Droplets className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No tanks registered yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Add your first water tank to start tracking cleaning history and managing maintenance.
                </p>
                <Link href="/tanks/new">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Tank
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tanks.map((tank) => (
                <Card key={tank.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Droplets className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{tank.name}</h3>
                          <p className="text-sm text-gray-600">{tank.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={tank.qrCode.isPaid ? "default" : "secondary"}>
                          {tank.qrCode.isPaid ? "Active" : "Payment Pending"}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Capacity:</span>
                        <p className="font-medium">{tank.capacity || "Not specified"}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Location:</span>
                        <p className="font-medium">{tank.location}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Last Cleaned:</span>
                        <p className="font-medium">{formatDate(tank.lastCleanedDate)}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Next Due:</span>
                        <p className="font-medium">{formatDate(tank.nextDueDate)}</p>
                      </div>
                    </div>

                    {tank.hygieneScore && (
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Shield className="w-5 h-5 text-blue-600" />
                          <span className="font-medium text-blue-900">Hygiene Score</span>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-500 mr-1" />
                            <span className="font-bold text-blue-900">{tank.hygieneScore}</span>
                          </div>
                          <p className="text-xs text-blue-700">{getHygieneScoreText(tank.hygieneScore)}</p>
                        </div>
                      </div>
                    )}

                    {tank.nextDueDate && getDaysRemaining(tank.nextDueDate) !== null && (
                      <div className={`p-3 rounded-lg ${
                        getDaysRemaining(tank.nextDueDate) <= 7 
                          ? "bg-red-50 border border-red-200" 
                          : "bg-yellow-50 border border-yellow-200"
                      }`}>
                        <div className="flex items-center space-x-2">
                          <Clock className={`w-4 h-4 ${
                            getDaysRemaining(tank.nextDueDate) <= 7 ? "text-red-600" : "text-yellow-600"
                          }`} />
                          <span className={`font-medium ${
                            getDaysRemaining(tank.nextDueDate) <= 7 ? "text-red-900" : "text-yellow-900"
                          }`}>
                            {getDaysRemaining(tank.nextDueDate) <= 0 
                              ? "Overdue" 
                              : `${getDaysRemaining(tank.nextDueDate)} days remaining`
                            }
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <QrCode className="w-4 h-4 mr-1" />
                          {tank.qrCode.code}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {tank._count.cleaningRecords} cleanings
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            // Simple QR code view
                            alert(`QR Code: ${tank.qrCode.code}`)
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            // Simple edit functionality
                            alert(`Edit tank: ${tank.name}`)
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}