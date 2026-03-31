'use client'

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  AlertTriangle, 
  Phone, 
  Clock, 
  MapPin, 
  CheckCircle, 
  User, 
  Mail, 
  ArrowLeft,
  Settings,
  Eye,
  Zap,
  Shield,
  Activity,
  Droplets
} from "lucide-react"
import { signOut } from "next-auth/react"
import { NotificationCenter } from "@/components/notifications"
import { MobileNav } from "@/components/mobile-nav"

interface EmergencyRequest {
  id: string
  userId: string
  tankId?: string
  contactName: string
  contactPhone: string
  contactEmail: string
  address: string
  urgencyLevel: string
  issueDescription: string
  requestedAt: string
  respondedAt?: string
  assignedCleanerId?: string
  estimatedArrival?: string
  status: string
  priorityFee: number
  totalCost: number
  assignedCleaner?: {
    user: {
      name: string
      phone: string
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

export default function EmergencyPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [emergencyRequests, setEmergencyRequests] = useState<EmergencyRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    tankId: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    address: "",
    urgencyLevel: "HIGH",
    issueDescription: ""
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

    loadEmergencyRequests()
  }, [session, status, router])

  const loadEmergencyRequests = async () => {
    try {
      // Mock data for demo
      const mockEmergencyRequests: EmergencyRequest[] = [
        {
          id: "1",
          userId: "user1",
          tankId: "tank1",
          contactName: "Rajesh Kumar",
          contactPhone: "+91 98765 43210",
          contactEmail: "rajesh@example.com",
          address: "123 Main Street, Bangalore",
          urgencyLevel: "CRITICAL",
          issueDescription: "Tank overflow causing water damage to building structure",
          requestedAt: "2024-01-25T10:30:00Z",
          respondedAt: "2024-01-25T10:35:00Z",
          assignedCleanerId: "cleaner1",
          estimatedArrival: "2024-01-25T11:00:00Z",
          status: "IN_PROGRESS",
          priorityFee: 500,
          totalCost: 1199,
          assignedCleaner: {
            user: {
              name: "Vijay Kumar",
              phone: "+91 98765 43211"
            }
          }
        },
        {
          id: "2",
          userId: "user2",
          contactName: "Priya Sharma",
          contactPhone: "+91 98765 43212",
          contactEmail: "priya@example.com",
          address: "456 Park Avenue, Mumbai",
          urgencyLevel: "HIGH",
          issueDescription: "Severe water contamination detected in drinking water tank",
          requestedAt: "2024-01-25T09:15:00Z",
          respondedAt: "2024-01-25T09:30:00Z",
          assignedCleanerId: "cleaner2",
          estimatedArrival: "2024-01-25T10:30:00Z",
          status: "COMPLETED",
          priorityFee: 300,
          totalCost: 999,
          assignedCleaner: {
            user: {
              name: "Amit Patel",
              phone: "+91 98765 43213"
            }
          },
          cleaningRecord: {
            id: "record1",
            cleanedAt: "2024-01-25T11:30:00Z",
            hygieneScore: 4.8
          },
          payment: {
            amount: 999,
            status: "COMPLETED"
          }
        }
      ]

      setEmergencyRequests(mockEmergencyRequests)
    } catch (error) {
      console.error("Failed to load emergency requests:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    if (!formData.contactName || !formData.contactPhone || !formData.address || !formData.issueDescription) {
      alert("Please fill in all required fields")
      return
    }

    // Calculate pricing based on urgency
    let basePrice = 699
    let priorityFee = 0
    
    switch (formData.urgencyLevel) {
      case "CRITICAL":
        priorityFee = 500
        basePrice = 1299
        break
      case "HIGH":
        priorityFee = 300
        basePrice = 999
        break
      case "MEDIUM":
        priorityFee = 100
        basePrice = 899
        break
      case "LOW":
        priorityFee = 0
        basePrice = 799
        break
    }

    const totalCost = basePrice + priorityFee

    try {
      const response = await fetch('/api/emergency', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          priorityFee,
          totalCost
        })
      })

      const result = await response.json()

      if (!response.ok) {
        alert(result.error || 'Failed to create emergency request')
        return
      }

      alert('Emergency request submitted successfully! We will contact you immediately.')
      setShowForm(false)
      setFormData({
        tankId: "",
        contactName: "",
        contactPhone: "",
        contactEmail: "",
        address: "",
        urgencyLevel: "HIGH",
        issueDescription: ""
      })
      loadEmergencyRequests()
    } catch (error) {
      alert("An error occurred. Please try again.")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'REQUESTED': return 'destructive'
      case 'ASSIGNED': return 'default'
      case 'IN_PROGRESS': return 'default'
      case 'COMPLETED': return 'default'
      case 'CANCELLED': return 'secondary'
      default: return 'secondary'
    }
  }

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'destructive'
      case 'HIGH': return 'default'
      case 'MEDIUM': return 'secondary'
      case 'LOW': return 'outline'
      default: return 'secondary'
    }
  }

  const getUrgencyIcon = (level: string) => {
    switch (level) {
      case 'CRITICAL': return <Zap className="w-4 h-4" />
      case 'HIGH': return <AlertTriangle className="w-4 h-4" />
      case 'MEDIUM': return <Activity className="w-4 h-4" />
      case 'LOW': return <Shield className="w-4 h-4" />
      default: return <Shield className="w-4 h-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getEmergencyPricing = () => {
    let basePrice = 699
    let priorityFee = 0
    
    switch (formData.urgencyLevel) {
      case "CRITICAL":
        priorityFee = 500
        basePrice = 1299
        break
      case "HIGH":
        priorityFee = 300
        basePrice = 999
        break
      case "MEDIUM":
        priorityFee = 100
        basePrice = 899
        break
      case "LOW":
        priorityFee = 0
        basePrice = 799
        break
    }

    return { basePrice, priorityFee, totalCost: basePrice + priorityFee }
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
    <div className="min-h-screen bg-red-50">
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
                <Link href="/bookings" className="text-gray-600 hover:text-gray-900">Bookings</Link>
                <Link href="/society" className="text-gray-600 hover:text-gray-900">Society</Link>
                <Link href="/emergency" className="text-red-600 font-medium">Emergency</Link>
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
        {!showForm ? (
          <>
            {/* Emergency Banner */}
            <Alert className="mb-8 border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="flex items-center justify-between">
                  <div>
                    <strong>24/7 Emergency Services Available</strong>
                    <span className="ml-2">Call us immediately for urgent water tank issues: </span>
                    <a href="tel:+919876543210" className="text-red-600 font-bold hover:underline">
                      +91 98765 43210
                    </a>
                  </div>
                  <Button size="sm" onClick={() => setShowForm(true)}>
                    <Phone className="w-4 h-4 mr-2" />
                    Request Emergency Service
                  </Button>
                </div>
              </AlertDescription>
            </Alert>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Emergency Services
                </h1>
                <p className="text-gray-600">
                  24/7 emergency cleaning services with priority response
                </p>
              </div>
              <Button onClick={() => setShowForm(true)} className="bg-red-600 hover:bg-red-700">
                <Zap className="w-4 h-4 mr-2" />
                Request Emergency Service
              </Button>
            </div>

            {/* Emergency Features */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-red-600" />
                    <CardTitle className="text-sm font-medium">24/7 Response</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">30 min</div>
                  <p className="text-xs text-muted-foreground">
                    Average response time
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-red-600" />
                    <CardTitle className="text-sm font-medium">Priority Service</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Immediate</div>
                  <p className="text-xs text-muted-foreground">
                    Priority assignment
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-red-600" />
                    <CardTitle className="text-sm font-medium">Direct Contact</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24/7</div>
                  <p className="text-xs text-muted-foreground">
                    Phone support
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-red-600" />
                    <CardTitle className="text-sm font-medium">Expert Team</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Certified</div>
                  <p className="text-xs text-muted-foreground">
                    Professional cleaners
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Emergency Requests List */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Recent Emergency Requests
              </h2>
              
              {emergencyRequests.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-12">
                      <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No Emergency Requests
                      </h3>
                      <p className="text-gray-600 mb-6">
                        No emergency requests have been submitted. Contact us immediately if you need emergency services.
                      </p>
                      <Button onClick={() => setShowForm(true)}>
                        <Zap className="w-4 h-4 mr-2" />
                        Request Emergency Service
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {emergencyRequests.map((request) => (
                    <Card key={request.id} className="border-l-4 border-l-red-500">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                              {getUrgencyIcon(request.urgencyLevel)}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {request.issueDescription}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {request.address}
                              </p>
                              <div className="flex items-center space-x-4 mt-1">
                                <span className="text-sm text-gray-500 flex items-center">
                                  <User className="w-3 h-3 mr-1" />
                                  {request.contactName}
                                </span>
                                <span className="text-sm text-gray-500 flex items-center">
                                  <Phone className="w-3 h-3 mr-1" />
                                  {request.contactPhone}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="space-y-2">
                              <Badge variant={getUrgencyColor(request.urgencyLevel)}>
                                {request.urgencyLevel}
                              </Badge>
                              <Badge variant={getStatusColor(request.status)}>
                                {request.status}
                              </Badge>
                              <div className="text-right">
                                <div className="font-bold text-red-600">₹{request.totalCost}</div>
                                <p className="text-xs text-gray-600">
                                  {request.priorityFee > 0 && `+₹${request.priorityFee} priority`}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-6 mt-6 pt-6 border-t">
                          <div className="space-y-4 text-sm">
                            <div>
                              <span className="font-medium">Requested:</span>
                              <p>{formatDate(request.requestedAt)}</p>
                            </div>
                            {request.respondedAt && (
                              <div>
                                <span className="font-medium">Responded:</span>
                                <p>{formatDate(request.respondedAt)}</p>
                              </div>
                            )}
                            <div>
                              <span className="font-medium">Contact:</span>
                              <p>{request.contactName}</p>
                              <p className="text-blue-600">
                                <a href={`tel:${request.contactPhone}`} className="hover:underline">
                                  {request.contactPhone}
                                </a>
                              </p>
                            </div>
                          </div>
                          
                          <div className="space-y-4 text-sm">
                            <div>
                              <span className="font-medium">Assigned Cleaner:</span>
                              <p>{request.assignedCleaner?.user.name || "Not assigned"}</p>
                              {request.assignedCleaner && (
                                <p className="text-blue-600">
                                  <a href={`tel:${request.assignedCleaner.user.phone}`} className="hover:underline">
                                    {request.assignedCleaner.user.phone}
                                  </a>
                                </p>
                              )}
                            </div>
                            {request.estimatedArrival && (
                              <div>
                                <span className="font-medium">Estimated Arrival:</span>
                                <p>{formatDate(request.estimatedArrival)}</p>
                              </div>
                            )}
                            {request.cleaningRecord && (
                              <div>
                                <span className="font-medium">Completed:</span>
                                <p>{formatDate(request.cleaningRecord.cleanedAt)}</p>
                                <div className="flex items-center mt-1">
                                  <span className="text-green-700">Hygiene Score:</span>
                                  <div className="flex items-center">
                                    <span className="text-green-900 font-bold ml-1">
                                      {request.cleaningRecord.hygieneScore}/5
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-6 pt-6 border-t">
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" asChild>
                              <Link href={`/emergency/${request.id}`}>
                                <Eye className="w-4 h-4" />
                              </Link>
                            </Button>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">
                              Request ID: {request.id.slice(0, 8)}...
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          /* Emergency Request Form */
          <Card className="max-w-4xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-red-900">
                Emergency Service Request
              </CardTitle>
              <CardDescription>
                Get immediate help for urgent water tank issues
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactName">Your Name *</Label>
                      <Input
                        id="contactName"
                        value={formData.contactName}
                        onChange={(e) => handleInputChange("contactName", e.target.value)}
                        placeholder="Enter your name"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Phone Number *</Label>
                      <Input
                        id="contactPhone"
                        value={formData.contactPhone}
                        onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Email Address</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={formData.contactEmail}
                        onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                        placeholder="Enter your email address"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Address *</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        placeholder="Enter complete address"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Tank Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Tank Information</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tankId">Tank (if registered)</Label>
                    <Select 
                      value={formData.tankId}
                      onValueChange={(value) => handleInputChange("tankId", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your tank (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">No tank registered</SelectItem>
                        <SelectItem value="tank1">Main Water Tank</SelectItem>
                        <SelectItem value="tank2">Overhead Tank</SelectItem>
                        <SelectItem value="tank3">Underground Tank</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Emergency Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Emergency Details</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="urgencyLevel">Urgency Level *</Label>
                    <Select 
                      value={formData.urgencyLevel}
                      onValueChange={(value) => handleInputChange("urgencyLevel", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select urgency level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CRITICAL">Critical - Life-threatening situation</SelectItem>
                        <SelectItem value="HIGH">High - Urgent attention needed</SelectItem>
                        <SelectItem value="MEDIUM">Medium - Can wait a few hours</SelectItem>
                        <SelectItem value="LOW">Low - Not immediately dangerous</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="issueDescription">Issue Description *</Label>
                    <Textarea
                      id="issueDescription"
                      value={formData.issueDescription}
                      onChange={(e) => handleInputChange("issueDescription", e.target.value)}
                      placeholder="Describe the emergency situation in detail"
                      rows={4}
                      required
                    />
                  </div>
                </div>

                {/* Pricing Preview */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-medium text-red-900 mb-3">Emergency Service Pricing</h4>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-red-700">Base Price:</span>
                      <p className="font-bold text-red-900">₹{getEmergencyPricing().basePrice}</p>
                    </div>
                    <div>
                      <span className="text-red-700">Priority Fee:</span>
                      <p className="font-bold text-red-600">+₹{getEmergencyPricing().priorityFee}</p>
                    </div>
                    <div>
                      <span className="text-red-700">Total Cost:</span>
                      <p className="font-bold text-red-900 text-lg">₹{getEmergencyPricing().totalCost}</p>
                    </div>
                  </div>
                  <p className="text-xs text-red-600 mt-2">
                    {formData.urgencyLevel === 'CRITICAL' && "Critical emergencies require immediate attention with highest priority"}
                    {formData.urgencyLevel === 'HIGH' && "High urgency requests get priority assignment"}
                    {formData.urgencyLevel === 'MEDIUM' && "Medium urgency will be handled as soon as possible"}
                    {formData.urgencyLevel === 'LOW' && "Low urgency will be scheduled accordingly"}
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                  <h4 className="font-medium text-blue-900 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Need Immediate Assistance?
                  </h4>
                  <p className="text-sm text-blue-700 mb-3">
                    Call our 24/7 emergency hotline for immediate assistance:
                  </p>
                  <div className="text-center">
                    <a 
                      href="tel:+919876543210" 
                      className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      +91 98765 43210
                    </a>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button type="submit" className="flex-1 bg-red-600 hover:bg-red-700">
                    <Zap className="w-4 h-4 mr-2" />
                    Submit Emergency Request
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowForm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}