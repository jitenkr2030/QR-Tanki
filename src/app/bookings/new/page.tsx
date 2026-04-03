// New Booking Page
// Page: /bookings/new

'use client'

import { useState, useEffect, Suspense } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  CreditCard, 
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Droplets,
  Phone,
  Mail
} from "lucide-react"

interface Tank {
  id: string
  name: string
  type: string
  capacity?: string
  location: string
  lastCleanedDate?: string
  hygieneScore?: number
}

interface CleaningType {
  id: string
  name: string
  description: string
  duration: number
  price: number
  features: string[]
}

function NewBookingContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const tankId = searchParams.get('tankId')
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [selectedTank, setSelectedTank] = useState<Tank | null>(null)
  const [userTanks, setUserTanks] = useState<Tank[]>([])
  const [selectedCleaningType, setSelectedCleaningType] = useState<CleaningType | null>(null)
  const [formData, setFormData] = useState({
    tankId: tankId || "",
    cleaningTypeId: "",
    preferredDate: "",
    preferredTime: "",
    specialInstructions: "",
    contactPhone: "",
    contactEmail: ""
  })

  const cleaningTypes: CleaningType[] = [
    {
      id: "basic",
      name: "BASIC",
      description: "Standard cleaning with basic sanitization",
      duration: 90,
      price: 699,
      features: ["Tank inspection", "Basic cleaning", "Sanitization", "Water testing"]
    },
    {
      id: "deep",
      name: "DEEP",
      description: "Comprehensive cleaning with advanced sanitization",
      duration: 120,
      price: 1299,
      features: ["Tank inspection", "Deep cleaning", "Advanced sanitization", "Water testing", "Sludge removal"]
    },
    {
      id: "emergency",
      name: "EMERGENCY",
      description: "Urgent cleaning with priority response",
      duration: 60,
      price: 1999,
      features: ["Priority response", "Emergency cleaning", "Advanced sanitization", "Water testing", "Same day service"]
    }
  ]

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

    loadUserTanks()
  }, [session, status, router, tankId])

  const loadUserTanks = async () => {
    try {
      // Mock user tanks data
      const mockTanks: Tank[] = [
        {
          id: "1",
          name: "Main Water Tank",
          type: "OVERHEAD",
          capacity: "1000 Liters",
          location: "Rooftop - Building A",
          lastCleanedDate: "2024-01-15",
          hygieneScore: 4.5
        },
        {
          id: "2",
          name: "Backup Tank",
          type: "UNDERGROUND",
          capacity: "500 Liters",
          location: "Backyard",
          lastCleanedDate: "2023-12-20",
          hygieneScore: 3.8
        }
      ]

      setUserTanks(mockTanks)
      
      // If tankId is provided, select that tank
      if (tankId) {
        const tank = mockTanks.find(t => t.id === tankId)
        if (tank) {
          setSelectedTank(tank)
          setFormData(prev => ({ ...prev, tankId: tank.id }))
        }
      }
    } catch (error) {
      console.error("Failed to load user tanks:", error)
    }
  }

  const handleTankChange = (tankId: string) => {
    const tank = userTanks.find(t => t.id === tankId)
    setSelectedTank(tank || null)
    setFormData(prev => ({ ...prev, tankId }))
  }

  const handleCleaningTypeChange = (typeId: string) => {
    const cleaningType = cleaningTypes.find(t => t.id === typeId)
    setSelectedCleaningType(cleaningType || null)
    setFormData(prev => ({ ...prev, cleaningTypeId: typeId }))
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError("")
  }

  const validateForm = () => {
    if (!formData.tankId) {
      setError("Please select a tank")
      return false
    }
    if (!formData.cleaningTypeId) {
      setError("Please select a cleaning type")
      return false
    }
    if (!formData.preferredDate) {
      setError("Please select a preferred date")
      return false
    }
    if (!formData.preferredTime) {
      setError("Please select a preferred time")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      // Mock booking creation
      const bookingData = {
        ...formData,
        userId: session.user.id,
        status: "PENDING",
        createdAt: new Date().toISOString()
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      setSuccess("Booking request submitted successfully! We will contact you to confirm the appointment.")
      
      // Reset form after successful submission
      setTimeout(() => {
        router.push('/dashboard')
      }, 3000)
      
    } catch (error) {
      console.error('Error creating booking:', error)
      setError("Failed to create booking. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading") {
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
            </div>
            <Link href="/dashboard">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Book Cleaning Service
          </h1>
          <p className="text-gray-600">
            Schedule a professional cleaning service for your water tank
          </p>
        </div>

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50 text-green-800">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Booking Details</CardTitle>
            <CardDescription>
              Provide details for your cleaning service booking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Tank Selection */}
              <div className="space-y-2">
                <Label htmlFor="tankId">Select Tank *</Label>
                <Select value={formData.tankId} onValueChange={handleTankChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a tank" />
                  </SelectTrigger>
                  <SelectContent>
                    {userTanks.map((tank) => (
                      <SelectItem key={tank.id} value={tank.id}>
                        {tank.name} - {tank.type} ({tank.capacity})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedTank && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{selectedTank.name}</p>
                        <p className="text-sm text-gray-600">{selectedTank.location}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Last cleaned:</p>
                        <p className="font-medium">
                          {selectedTank.lastCleanedDate || "Never"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Cleaning Type Selection */}
              <div className="space-y-2">
                <Label htmlFor="cleaningTypeId">Cleaning Type *</Label>
                <Select value={formData.cleaningTypeId} onValueChange={handleCleaningTypeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select cleaning type" />
                  </SelectTrigger>
                  <SelectContent>
                    {cleaningTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        <div>
                          <div className="font-medium">{type.name}</div>
                          <div className="text-sm text-gray-600">{type.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedCleaningType && (
                  <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium">{selectedCleaningType.name}</p>
                        <p className="text-sm text-gray-600">{selectedCleaningType.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">₹{selectedCleaningType.price}</p>
                        <p className="text-sm text-gray-600">{selectedCleaningType.duration} mins</p>
                      </div>
                    </div>
                    <div className="border-t pt-2">
                      <p className="text-sm font-medium text-gray-700 mb-1">Included:</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedCleaningType.features.map((feature, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Preferred Date and Time */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="preferredDate">Preferred Date *</Label>
                  <Input
                    id="preferredDate"
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) => handleInputChange("preferredDate", e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preferredTime">Preferred Time *</Label>
                  <Select value={formData.preferredTime} onValueChange={(value) => handleInputChange("preferredTime", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="09:00">9:00 AM</SelectItem>
                      <SelectItem value="10:00">10:00 AM</SelectItem>
                      <SelectItem value="11:00">11:00 AM</SelectItem>
                      <SelectItem value="12:00">12:00 PM</SelectItem>
                      <SelectItem value="14:00">2:00 PM</SelectItem>
                      <SelectItem value="15:00">3:00 PM</SelectItem>
                      <SelectItem value="16:00">4:00 PM</SelectItem>
                      <SelectItem value="17:00">5:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Contact Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Phone Number *</Label>
                    <Input
                      id="contactPhone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.contactPhone}
                      onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Email Address</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.contactEmail}
                      onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Special Instructions */}
              <div className="space-y-2">
                <Label htmlFor="specialInstructions">Special Instructions (Optional)</Label>
                <Textarea
                  id="specialInstructions"
                  placeholder="Any special requirements or instructions for the cleaning service..."
                  value={formData.specialInstructions}
                  onChange={(e) => handleInputChange("specialInstructions", e.target.value)}
                  rows={3}
                />
              </div>

              {/* Price Summary */}
              {selectedCleaningType && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium mb-2">Price Summary</h3>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>Service ({selectedCleaningType.name})</span>
                      <span>₹{selectedCleaningType.price}</span>
                    </div>
                    <div className="flex justify-between font-medium text-lg">
                      <span>Total Amount</span>
                      <span className="text-blue-600">₹{selectedCleaningType.price}</span>
                    </div>
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Submitting..." : "Submit Booking Request"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
    </div>
  )
}

// Main component with Suspense boundary
export default function NewBookingPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <NewBookingContent />
    </Suspense>
  )
}