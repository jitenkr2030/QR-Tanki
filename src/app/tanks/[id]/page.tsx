'use client'

import { useState, useEffect, Suspense } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Droplets, 
  QrCode, 
  Calendar, 
  Clock, 
  MapPin, 
  Star,
  ArrowLeft,
  Edit,
  Camera,
  Download,
  Shield,
  CheckCircle,
  AlertTriangle,
  History,
  Plus,
  Settings,
  Eye
} from "lucide-react"
import { signOut } from "next-auth/react"

interface Tank {
  id: string
  name: string
  type: string
  capacity?: string
  location: string
  lastCleanedDate?: string
  nextDueDate?: string
  hygieneScore?: number
  isActive: boolean
  qrCode: {
    id: string
    code: string
    isPaid: boolean
    isGenerated: boolean
    generatedAt?: string
  }
  createdAt: string
  updatedAt: string
}

interface CleaningRecord {
  id: string
  cleaningType: string
  cleanedAt: string
  hygieneScore?: number
  duration?: number
  beforePhotos?: string
  afterPhotos?: string
  notes?: string
  cleaner: {
    user: {
      name: string
      phone: string
    }
  }
  status: string
}

function TankDetailContent({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [tank, setTank] = useState<Tank | null>(null)
  const [cleaningHistory, setCleaningHistory] = useState<CleaningRecord[]>([])
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

    loadTankData()
  }, [session, status, router, params.id])

  const loadTankData = async () => {
    try {
      // Mock tank data for demo
      const mockTank: Tank = {
        id: params.id,
        name: "Main Water Tank",
        type: "OVERHEAD",
        capacity: "1000 Liters",
        location: "Rooftop - Building A",
        lastCleanedDate: "2024-01-15",
        nextDueDate: "2024-02-15",
        hygieneScore: 4.5,
        isActive: true,
        qrCode: {
          id: "qr-123",
          code: "QT-123456",
          isPaid: true,
          isGenerated: true,
          generatedAt: "2024-01-01"
        },
        createdAt: "2024-01-01",
        updatedAt: "2024-01-25"
      }

      const mockCleaningHistory: CleaningRecord[] = [
        {
          id: "1",
          cleaningType: "BASIC",
          cleanedAt: "2024-01-15",
          hygieneScore: 4.5,
          duration: 90,
          beforePhotos: '["before1.jpg", "before2.jpg"]',
          afterPhotos: '["after1.jpg", "after2.jpg"]',
          notes: "Cleaning completed successfully. Tank is now ready for use.",
          cleaner: {
            user: {
              name: "Raj Kumar",
              phone: "+91 98765 43210"
            }
          },
          status: "COMPLETED"
        },
        {
          id: "2",
          cleaningType: "DEEP",
          cleanedAt: "2023-12-20",
          hygieneScore: 4.2,
          duration: 120,
          beforePhotos: '["before3.jpg", "before4.jpg"]',
          afterPhotos: '["after3.jpg", "after4.jpg"]',
          notes: "Deep cleaning performed. All contaminants removed.",
          cleaner: {
            user: {
              name: "Amit Singh",
              phone: "+91 98765 43211"
            }
          },
          status: "COMPLETED"
        }
      ]

      setTank(mockTank)
      setCleaningHistory(mockCleaningHistory)
    } catch (error) {
      console.error("Failed to load tank data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  const downloadQRCode = () => {
    // Mock QR code download
    const qrData = {
      tankCode: tank?.qrCode.code,
      tankName: tank?.name,
      tankType: tank?.type,
      location: tank?.location,
      generatedAt: new Date().toISOString()
    }

    const dataStr = JSON.stringify(qrData, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `qr-code-${tank?.name.replace(/\s+/g, '-')}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getHygieneScoreColor = (score: number) => {
    if (score >= 4.5) return 'text-green-600 bg-green-100'
    if (score >= 3.5) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getHygieneScoreLabel = (score: number) => {
    if (score >= 4.5) return 'Excellent'
    if (score >= 3.5) return 'Good'
    return 'Needs Attention'
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session || !tank) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
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
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" asChild className="text-gray-600 hover:text-gray-900">
            <Link href="/tanks">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to My Tanks
            </Link>
          </Button>
        </div>

        {/* Tank Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{tank.name}</h1>
              <p className="text-gray-600">{tank.type} • {tank.capacity}</p>
            </div>
            <div className="flex items-center space-x-2 mt-4 sm:mt-0">
              <Badge variant={tank.isActive ? "default" : "secondary"}>
                {tank.isActive ? "Active" : "Inactive"}
              </Badge>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/tanks/${tank.id}/edit`}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Tank Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Droplets className="w-5 h-5 mr-2" />
                Tank Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-sm text-gray-600">Type:</span>
                <p className="font-medium">{tank.type}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Capacity:</span>
                <p className="font-medium">{tank.capacity}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Location:</span>
                <p className="font-medium">{tank.location}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Status:</span>
                <Badge variant={tank.isActive ? "default" : "secondary"} className="mt-1">
                  {tank.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* QR Code Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <QrCode className="w-5 h-5 mr-2" />
                QR Code
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-sm text-gray-600">QR Code:</span>
                <p className="font-mono text-sm bg-gray-100 p-2 rounded">{tank.qrCode.code}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Status:</span>
                <Badge variant={tank.qrCode.isPaid ? "default" : "secondary"} className="mt-1">
                  {tank.qrCode.isPaid ? "Paid" : "Payment Pending"}
                </Badge>
              </div>
              <div>
                <span className="text-sm text-gray-600">Generated:</span>
                <p className="font-medium">
                  {tank.qrCode.isGenerated ? formatDate(tank.qrCode.generatedAt!) : "Not Generated"}
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={downloadQRCode}
                disabled={!tank.qrCode.isGenerated}
              >
                <Download className="w-4 h-4 mr-2" />
                Download QR Code
              </Button>
            </CardContent>
          </Card>

          {/* Hygiene Score */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="w-5 h-5 mr-2" />
                Hygiene Score
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className={`text-4xl font-bold rounded-full w-20 h-20 flex items-center justify-center mx-auto ${getHygieneScoreColor(tank.hygieneScore || 0)}`}>
                  {tank.hygieneScore || 'N/A'}
                </div>
                <p className={`mt-2 font-medium ${getHygieneScoreColor(tank.hygieneScore || 0)}`}>
                  {getHygieneScoreLabel(tank.hygieneScore || 0)}
                </p>
              </div>
              <div className="text-center">
                <span className="text-sm text-gray-600">Last Updated:</span>
                <p className="font-medium">{formatDate(tank.updatedAt)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cleaning Schedule */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Cleaning Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <span className="text-sm text-gray-600">Last Cleaned:</span>
                <p className="font-medium">
                  {tank.lastCleanedDate ? formatDate(tank.lastCleanedDate) : "Never"}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Next Due:</span>
                <p className={`font-medium ${tank.nextDueDate ? "text-orange-600" : "text-gray-500"}`}>
                  {tank.nextDueDate ? formatDate(tank.nextDueDate) : "Not Scheduled"}
                </p>
              </div>
            </div>
            <div className="mt-6">
              <Button className="w-full" asChild>
                <Link href={`/bookings/new?tankId=${tank.id}`}>
                  <Plus className="w-4 h-4 mr-2" />
                  Book Cleaning Service
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Cleaning History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <History className="w-5 h-5 mr-2" />
              Cleaning History
            </CardTitle>
            <CardDescription>
              Track all cleaning services for this tank
            </CardDescription>
          </CardHeader>
          <CardContent>
            {cleaningHistory.length === 0 ? (
              <div className="text-center py-12">
                <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Cleaning History
                </h3>
                <p className="text-gray-600 mb-6">
                  This tank hasn't been cleaned yet. Book your first cleaning service to get started.
                </p>
                <Button asChild>
                  <Link href={`/bookings/new?tankId=${tank.id}`}>
                    <Plus className="w-4 h-4 mr-2" />
                    Book First Cleaning
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {cleaningHistory.map((record) => (
                  <div key={record.id} className="border rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          record.status === 'COMPLETED' ? 'bg-green-100' : 'bg-blue-100'
                        }`}>
                          {record.status === 'COMPLETED' ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <Clock className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{record.cleaningType} Cleaning</h4>
                          <p className="text-sm text-gray-600">
                            By {record.cleaner.user.name} • {formatDate(record.cleanedAt)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center space-x-2 mb-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="font-bold">{record.hygieneScore}/5</span>
                        </div>
                        <Badge variant={record.status === 'COMPLETED' ? "default" : "secondary"}>
                          {record.status}
                        </Badge>
                      </div>
                    </div>
                    
                    {record.duration && (
                      <div className="mb-4">
                        <span className="text-sm text-gray-600">Duration:</span>
                        <span className="ml-2 font-medium">{record.duration} minutes</span>
                      </div>
                    )}
                    
                    {record.notes && (
                      <div className="mb-4">
                        <span className="text-sm text-gray-600">Notes:</span>
                        <p className="mt-1 text-sm text-gray-700 bg-gray-50 p-3 rounded">
                          {record.notes}
                        </p>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-sm text-gray-600">
                        Cleaner: {record.cleaner.user.name}
                      </div>
                      <div className="text-sm text-blue-600">
                        <a href={`tel:${record.cleaner.user.phone}`} className="hover:underline">
                          {record.cleaner.user.phone}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

// Loading fallback component
function TankDetailLoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
    </div>
  )
}

// Main component with Suspense boundary
export default function TankDetailPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<TankDetailLoadingFallback />}>
      <TankDetailContent params={params} />
    </Suspense>
  )
}