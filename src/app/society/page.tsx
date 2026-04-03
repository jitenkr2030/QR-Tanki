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
  Building, 
  Users, 
  Plus, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Percent,
  CheckCircle, 
  AlertCircle, 
  ArrowLeft,
  Settings,
  Eye,
  Edit,
  Trash2,
  Calculator,
  FileText,
  Droplets,
  User
} from "lucide-react"
import { signOut } from "next-auth/react"
import { NotificationCenter } from "@/components/notifications"
import { MobileNav } from "@/components/mobile-nav"

interface GroupBooking {
  id: string
  societyName: string
  contactPerson: string
  contactPhone: string
  contactEmail: string
  address: string
  totalTanks: number
  discountRate: number
  basePrice: number
  discountedPrice: number
  status: string
  scheduledDate?: string
  preferredTime?: string
  notes?: string
  createdAt: string
  groupMembers: GroupMember[]
  payments: Payment[]
}

interface GroupMember {
  id: string
  tankName: string
  tankType: string
  tankCapacity?: string
  tankLocation: string
  isPrimaryContact: boolean
  user: {
    name: string
    email: string
    phone?: string
  }
}

export default function SocietyPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [groupBookings, setGroupBookings] = useState<GroupBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    societyName: "",
    contactPerson: "",
    contactPhone: "",
    contactEmail: "",
    address: "",
    totalTanks: 1,
    preferredTime: "",
    notes: ""
  })
  const [groupMembers, setGroupMembers] = useState([{
    tankName: "",
    tankType: "OVERHEAD",
    tankCapacity: "",
    tankLocation: "",
    isPrimaryContact: false
  }])

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

    loadGroupBookings()
  }, [session, status, router])

  const loadGroupBookings = async () => {
    try {
      // Mock data for demo
      const mockGroupBookings: GroupBooking[] = [
        {
          id: "1",
          societyName: "Sunshine Apartments",
          contactPerson: "Ramesh Kumar",
          contactPhone: "+91 98765 43210",
          contactEmail: "ramesh@sunshine.com",
          address: "123 Main Street, Bangalore",
          totalTanks: 5,
          discountRate: 0.15,
          basePrice: 3495,
          discountedPrice: 2970,
          status: "CONFIRMED",
          scheduledDate: "2024-02-01",
          preferredTime: "10:00 AM",
          notes: "Please call before arrival",
          createdAt: "2024-01-25",
          groupMembers: [],
          payments: []
        },
        {
          id: "2",
          societyName: "Green Valley Society",
          contactPerson: "Priya Sharma",
          contactPhone: "+91 98765 43211",
          contactEmail: "priya@greenvalley.com",
          address: "456 Park Avenue, Mumbai",
          totalTanks: 8,
          discountRate: 0.2,
          basePrice: 5592,
          discountedPrice: 4474,
          status: "PENDING",
          scheduledDate: "2024-02-05",
          preferredTime: "2:00 PM",
          notes: "Multiple tanks on different floors",
          createdAt: "2024-01-24",
          groupMembers: [],
          payments: []
        }
      ]

      setGroupBookings(mockGroupBookings)
    } catch (error) {
      console.error("Failed to load group bookings:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleMemberChange = (index: number, field: string, value: string | boolean) => {
    const updatedMembers = [...groupMembers]
    updatedMembers[index] = { ...updatedMembers[index], [field]: value }
    setGroupMembers(updatedMembers)
  }

  const addGroupMember = () => {
    setGroupMembers([...groupMembers, {
      tankName: "",
      tankType: "OVERHEAD",
      tankCapacity: "",
      tankLocation: "",
      isPrimaryContact: false
    }])
  }

  const removeGroupMember = (index: number) => {
    setGroupMembers(groupMembers.filter((_, i) => i !== index))
  }

  const calculatePricing = () => {
    const basePricePerTank = 699 // Basic cleaning price
    const baseTotal = basePricePerTank * formData.totalTanks
    const discountedTotal = baseTotal * (1 - 0.1) // 10% default discount
    return { basePrice: baseTotal, discountedPrice: discountedTotal }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    if (!formData.societyName || !formData.contactPerson || !formData.contactPhone || !formData.address) {
      alert("Please fill in all required fields")
      return
    }

    if (groupMembers.length === 0) {
      alert("Please add at least one tank")
      return
    }

    // Validate group members
    const invalidMember = groupMembers.find(member => !member.tankName || !member.tankLocation)
    if (invalidMember) {
      alert("Please fill in tank name and location for all tanks")
      return
    }

    // Calculate pricing
    const pricing = calculatePricing()

    try {
      const response = await fetch('/api/group-booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          groupMembers,
          ...pricing
        })
      })

      const result = await response.json()

      if (!response.ok) {
        alert(result.error || 'Failed to create group booking')
        return
      }

      alert('Group booking request created successfully!')
      setShowForm(false)
      setFormData({
        societyName: "",
        contactPerson: "",
        contactPhone: "",
        contactEmail: "",
        address: "",
        totalTanks: 1,
        preferredTime: "",
        notes: ""
      })
      setGroupMembers([{
        tankName: "",
        tankType: "OVERHEAD",
        tankCapacity: "",
        tankLocation: "",
        isPrimaryContact: false
      }])
      loadGroupBookings()
    } catch (error) {
      alert("An error occurred. Please try again.")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'secondary'
      case 'CONFIRMED': return 'default'
      case 'COMPLETED': return 'default'
      case 'CANCELLED': return 'destructive'
      default: return 'secondary'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
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
                <Link href="/tanks" className="text-gray-600 hover:text-gray-900">My Tanks</Link>
                <Link href="/bookings" className="text-gray-600 hover:text-gray-900">Bookings</Link>
                <Link href="/society" className="text-blue-600 font-medium">Society</Link>
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
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Society & Group Bookings
                </h1>
                <p className="text-gray-600">
                  Book discounted cleaning services for societies and buildings
                </p>
              </div>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Group Booking
              </Button>
            </div>

            {/* Benefits Section */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-blue-600" />
                    <CardTitle className="text-sm font-medium">Group Discounts</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">10-20%</div>
                  <p className="text-xs text-muted-foreground">
                    Discount on multiple tanks
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-green-600" />
                    <CardTitle className="text-sm font-medium">Society Management</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Easy</div>
                  <p className="text-xs text-muted-foreground">
                    Single point of contact
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-purple-600" />
                    <CardTitle className="text-sm font-medium">Flexible Scheduling</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Custom</div>
                  <p className="text-xs text-muted-foreground">
                    Preferred time slots
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Group Bookings List */}
            <div className="space-y-6">
              {groupBookings.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-12">
                      <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No Group Bookings Yet
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Create your first group booking to enjoy discounted rates for multiple tanks.
                      </p>
                      <Button onClick={() => setShowForm(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Group Booking
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {groupBookings.map((booking) => (
                    <Card key={booking.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Building className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{booking.societyName}</h3>
                              <p className="text-sm text-gray-600">
                                {booking.totalTanks} tanks • {booking.address}
                              </p>
                              <div className="flex items-center space-x-4 mt-1">
                                <span className="text-sm text-gray-500 flex items-center">
                                  <User className="w-3 h-3 mr-1" />
                                  {booking.contactPerson}
                                </span>
                                <span className="text-sm text-gray-500 flex items-center">
                                  <Phone className="w-3 h-3 mr-1" />
                                  {booking.contactPhone}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <Badge variant={getStatusColor(booking.status)}>
                              {booking.status}
                            </Badge>
                            <div className="mt-2">
                              <div className="text-sm text-gray-600">Total</div>
                              <div className="text-lg font-bold">₹{booking.discountedPrice}</div>
                              <div className="text-xs text-green-600">
                                {booking.discountRate * 100}% discount applied
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-6 text-sm">
                          <div>
                            <span className="font-medium">Scheduled Date:</span>
                            <p>{booking.scheduledDate ? formatDate(booking.scheduledDate) : "Not scheduled"}</p>
                          </div>
                          <div>
                            <span className="font-medium">Preferred Time:</span>
                            <p>{booking.preferredTime || "Not specified"}</p>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Base Price:</span>
                            <p>₹{booking.basePrice}</p>
                          </div>
                          <div>
                            <span className="font-medium">Discount:</span>
                            <p className="text-green-600">{booking.discountRate * 100}%</p>
                          </div>
                          <div>
                            <span className="font-medium">Final Price:</span>
                            <p className="font-bold">₹{booking.discountedPrice}</p>
                          </div>
                        </div>

                        {booking.notes && (
                          <div>
                            <span className="font-medium text-sm">Notes:</span>
                            <p className="text-sm text-gray-600 mt-1">{booking.notes}</p>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" asChild>
                              <Link href={`/society/${booking.id}`}>
                                <Eye className="w-4 h-4" />
                              </Link>
                            </Button>
                            <Button size="sm" variant="outline" asChild>
                              <Link href={`/society/${booking.id}/edit`}>
                                <Edit className="w-4 h-4" />
                              </Link>
                            </Button>
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
              )}
            </div>
          </>
        ) : (
          /* Group Booking Form */
          <Card className="max-w-4xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-blue-900">
                Create Group Booking
              </CardTitle>
              <CardDescription>
                Book cleaning services for multiple tanks at discounted rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Society Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Society Information</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="societyName">Society Name *</Label>
                      <Input
                        id="societyName"
                        value={formData.societyName}
                        onChange={(e) => handleInputChange("societyName", e.target.value)}
                        placeholder="Enter society name"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contactPerson">Contact Person *</Label>
                      <Input
                        id="contactPerson"
                        value={formData.contactPerson}
                        onChange={(e) => handleInputChange("contactPerson", e.target.value)}
                        placeholder="Enter contact person name"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Phone Number *</Label>
                      <Input
                        id="contactPhone"
                        value={formData.contactPhone}
                        onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                        placeholder="Enter phone number"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Email Address</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={formData.contactEmail}
                        onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                        placeholder="Enter email address"
                      />
                    </div>
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

                {/* Tank Information */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Tank Information</h3>
                    <div className="flex items-center space-x-4">
                      <Label htmlFor="totalTanks">Number of Tanks:</Label>
                      <Input
                        id="totalTanks"
                        type="number"
                        min="1"
                        value={formData.totalTanks}
                        onChange={(e) => handleInputChange("totalTanks", parseInt(e.target.value))}
                        className="w-20"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {groupMembers.map((member, index) => (
                      <div key={index} className="border rounded-lg p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Tank {index + 1}</h4>
                          {groupMembers.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeGroupMember(index)}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          )}
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Tank Name *</Label>
                            <Input
                              value={member.tankName}
                              onChange={(e) => handleMemberChange(index, "tankName", e.target.value)}
                              placeholder="Enter tank name"
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Tank Type *</Label>
                            <Select 
                              value={member.tankType}
                              onValueChange={(value) => handleMemberChange(index, "tankType", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select tank type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="OVERHEAD">Overhead</SelectItem>
                                <SelectItem value="UNDERGROUND">Underground</SelectItem>
                                <SelectItem value="SINTANK">Sintank</SelectItem>
                                <SelectItem value="PLASTIC">Plastic</SelectItem>
                                <SelectItem value="CONCRETE">Concrete</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Capacity (Liters)</Label>
                            <Input
                              value={member.tankCapacity || ""}
                              onChange={(e) => handleMemberChange(index, "tankCapacity", e.target.value)}
                              placeholder="Enter tank capacity"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Location *</Label>
                            <Input
                              value={member.tankLocation}
                              onChange={(e) => handleMemberChange(index, "tankLocation", e.target.value)}
                              placeholder="Enter tank location"
                              required
                            />
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`primary-${index}`}
                            checked={member.isPrimaryContact}
                            onChange={(e) => handleMemberChange(index, "isPrimaryContact", e.target.checked)}
                            className="rounded"
                          />
                          <Label htmlFor={`primary-${index}`} className="text-sm">
                            Primary contact for this tank
                          </Label>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={addGroupMember}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Another Tank
                  </Button>
                </div>

                {/* Pricing Preview */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-3">Pricing Preview</h4>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700">Base Price:</span>
                      <p className="font-bold text-blue-900">₹{calculatePricing().basePrice}</p>
                    </div>
                    <div>
                      <span className="text-blue-700">Discount (10%):</span>
                      <p className="font-bold text-green-600">-₹{(calculatePricing().basePrice * 0.1).toFixed(0)}</p>
                    </div>
                    <div>
                      <span className="text-blue-700">Final Price:</span>
                      <p className="font-bold text-blue-900 text-lg">₹{calculatePricing().discountedPrice}</p>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="preferredTime">Preferred Time</Label>
                      <Input
                        id="preferredTime"
                        value={formData.preferredTime}
                        onChange={(e) => handleInputChange("preferredTime", e.target.value)}
                        placeholder="e.g., 10:00 AM - 2:00 PM"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      placeholder="Any special requirements or instructions"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button type="submit" className="flex-1">
                    Submit Group Booking
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