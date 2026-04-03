'use client'

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  Droplets, 
  ArrowLeft, 
  Calendar, 
  Clock, 
  AlertCircle, 
  CheckCircle,
  CreditCard,
  MapPin,
  User,
  Star
} from "lucide-react"

interface Tank {
  id: string
  name: string
  type: string
  capacity?: string
  location: string
  qrCode: {
    code: string
    isPaid: boolean
  }
}

export default function NewBooking() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [tanks, setTanks] = useState<Tank[]>([])
  const [bookingCreated, setBookingCreated] = useState<any>(null)
  const [formData, setFormData] = useState({
    tankId: "",
    cleaningType: "",
    scheduledDate: "",
    preferredTime: "",
    notes: "",
    urgencyLevel: "1"
  })

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

    // Load user's tanks
    loadTanks()
  }, [session, status, router])

  const loadTanks = async () => {
    try {
      const response = await fetch('/api/tanks')
      const result = await response.json()
      
      if (response.ok) {
        // Filter tanks that have paid QR codes
        const paidTanks = result.tanks.filter((tank: Tank) => tank.qrCode.isPaid)
        setTanks(paidTanks)
      }
    } catch (error) {
      console.error("Failed to load tanks:", error)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError("")
  }

  const validateForm = () => {
    if (!formData.tankId || !formData.cleaningType || !formData.scheduledDate) {
      setError("Please fill in all required fields")
      return false
    }

    const scheduledDate = new Date(formData.scheduledDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (scheduledDate < today) {
      setError("Scheduled date cannot be in the past")
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
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || 'Failed to create booking')
        return
      }

      setBookingCreated(result.request)
      setSuccess("Cleaning request created successfully!")
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const getCleaningPrice = (type: string) => {
    switch (type) {
      case 'BASIC': return 699
      case 'DEEP': return 899
      case 'EMERGENCY': return 1299
      default: return 0
    }
  }

  const getCleaningDescription = (type: string) => {
    switch (type) {
      case 'BASIC': return 'Standard cleaning with basic sanitization'
      case 'DEEP': return 'Thorough cleaning with sediment removal and disinfection'
      case 'EMERGENCY': return 'Urgent cleaning service with priority handling'
      default: return ''
    }
  }

  const getSelectedTank = () => {
    return tanks.find(tank => tank.id === formData.tankId)
  }

  const proceedToPayment = () => {
    if (bookingCreated) {
      router.push(`/payment?booking=${bookingCreated.id}`)
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
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Droplets className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">QR Tanki</span>
            </Link>
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
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Book Cleaning Service
          </h1>
          <p className="text-gray-600">
            Schedule a professional cleaning service for your water tank
          </p>
        </div>

        {!bookingCreated ? (
          <Card>
            <CardHeader>
              <CardTitle>Service Details</CardTitle>
              <CardDescription>
                Provide details about the cleaning service you need
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
                
                {success && (
                  <Alert className="border-green-200 bg-green-50 text-green-800">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}

                {tanks.length === 0 ? (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      You need to add a tank with a paid QR code before booking a cleaning service.
                      <Link href="/tanks/new" className="text-blue-600 hover:underline ml-1">
                        Add a tank now
                      </Link>
                    </AlertDescription>
                  </Alert>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="tankId">Select Tank *</Label>
                      <Select value={formData.tankId} onValueChange={(value) => handleChange("tankId", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a tank" />
                        </SelectTrigger>
                        <SelectContent>
                          {tanks.map((tank) => (
                            <SelectItem key={tank.id} value={tank.id}>
                              {tank.name} - {tank.type} ({tank.location})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {getSelectedTank() && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-medium text-blue-900 mb-2">Selected Tank:</h4>
                        <div className="text-sm text-blue-800 space-y-1">
                          <p><strong>Name:</strong> {getSelectedTank()?.name}</p>
                          <p><strong>Type:</strong> {getSelectedTank()?.type}</p>
                          <p><strong>Capacity:</strong> {getSelectedTank()?.capacity || 'Not specified'}</p>
                          <p><strong>Location:</strong> {getSelectedTank()?.location}</p>
                          <p><strong>QR Code:</strong> {getSelectedTank()?.qrCode.code}</p>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="cleaningType">Cleaning Type *</Label>
                      <Select value={formData.cleaningType} onValueChange={(value) => handleChange("cleaningType", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select cleaning type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BASIC">
                            <div className="flex items-center justify-between w-full">
                              <span>Basic Cleaning</span>
                              <Badge variant="outline" className="ml-2">₹699</Badge>
                            </div>
                          </SelectItem>
                          <SelectItem value="DEEP">
                            <div className="flex items-center justify-between w-full">
                              <span>Deep Cleaning</span>
                              <Badge variant="outline" className="ml-2">₹899</Badge>
                            </div>
                          </SelectItem>
                          <SelectItem value="EMERGENCY">
                            <div className="flex items-center justify-between w-full">
                              <span>Emergency Cleaning</span>
                              <Badge variant="outline" className="ml-2">₹1,299</Badge>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {formData.cleaningType && (
                        <p className="text-sm text-gray-600">
                          {getCleaningDescription(formData.cleaningType)}
                        </p>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="scheduledDate">Preferred Date *</Label>
                        <Input
                          id="scheduledDate"
                          type="date"
                          value={formData.scheduledDate}
                          onChange={(e) => handleChange("scheduledDate", e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          required
                          disabled={loading}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="preferredTime">Preferred Time</Label>
                        <Input
                          id="preferredTime"
                          type="time"
                          value={formData.preferredTime}
                          onChange={(e) => handleChange("preferredTime", e.target.value)}
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="urgencyLevel">Urgency Level</Label>
                      <Select value={formData.urgencyLevel} onValueChange={(value) => handleChange("urgencyLevel", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select urgency level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Low - Can wait</SelectItem>
                          <SelectItem value="2">Medium - Within a week</SelectItem>
                          <SelectItem value="3">High - Within 3 days</SelectItem>
                          <SelectItem value="4">Urgent - Within 24 hours</SelectItem>
                          <SelectItem value="5">Emergency - As soon as possible</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Additional Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        placeholder="Any specific requirements or instructions for the cleaner..."
                        value={formData.notes}
                        onChange={(e) => handleChange("notes", e.target.value)}
                        disabled={loading}
                        rows={3}
                      />
                    </div>

                    {formData.cleaningType && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h4 className="font-medium text-yellow-900 mb-2">Payment Information:</h4>
                        <div className="text-sm text-yellow-800">
                          <p><strong>Service:</strong> {formData.cleaningType} Cleaning</p>
                          <p><strong>Price:</strong> ₹{getCleaningPrice(formData.cleaningType)}</p>
                          <p><strong>Payment:</strong> Required to confirm booking</p>
                        </div>
                      </div>
                    )}

                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Creating Booking..." : "Create Booking Request"}
                    </Button>
                  </>
                )}
              </form>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl">Booking Request Created!</CardTitle>
                <CardDescription>
                  Your cleaning service has been scheduled
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium mb-3">Booking Details:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Request ID:</span>
                      <span className="font-mono">{bookingCreated.id.slice(0, 8)}...</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tank:</span>
                      <span>{bookingCreated.tank.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service Type:</span>
                      <span>{bookingCreated.cleaningType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Scheduled Date:</span>
                      <span>{new Date(bookingCreated.scheduledDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Preferred Time:</span>
                      <span>{bookingCreated.preferredTime || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge variant="secondary">{bookingCreated.status}</Badge>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">What's Next?</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>1. Complete the payment to confirm your booking</li>
                    <li>2. You'll receive a confirmation with cleaner details</li>
                    <li>3. Cleaner will contact you before the scheduled time</li>
                    <li>4. Service will be performed as per your requirements</li>
                    <li>5. You'll receive photos and hygiene score after cleaning</li>
                  </ul>
                </div>

                <div className="text-center space-y-4">
                  <div className="text-2xl font-bold">
                    Total Amount: ₹{getCleaningPrice(bookingCreated.cleaningType)}
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <Button variant="outline" onClick={() => setBookingCreated(null)}>
                      Book Another Service
                    </Button>
                    <Button onClick={proceedToPayment}>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Pay Now
                    </Button>
                  </div>

                  <Link href="/dashboard">
                    <Button variant="outline" className="w-full">
                      Go to Dashboard
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}