'use client'

import { useState } from "react"
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
import { 
  Droplets, 
  ArrowLeft, 
  QrCode, 
  AlertCircle, 
  CheckCircle,
  CreditCard,
  Download
} from "lucide-react"

export default function NewTank() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [qrCodeGenerated, setQrCodeGenerated] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    capacity: "",
    location: "",
    installationDate: ""
  })

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError("")
  }

  const validateForm = () => {
    if (!formData.name || !formData.type || !formData.location) {
      setError("Please fill in all required fields")
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
      // Create tank with QR code
      const response = await fetch('/api/tanks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userId: session.user.id
        })
      })

      const result = await response.json()

      if (!result.success) {
        setError(result.error || 'Failed to create tank')
        return
      }

      setQrCodeGenerated({
        id: result.tank.qrCode.id,
        code: result.tank.qrCode.code,
        image: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(result.tank.qrCode.code)}&format=png&margin=10&color=000000&bgcolor=FFFFFF`,
        isPaid: result.tank.qrCode.isPaid
      })
      setSuccess("Tank created successfully! QR code generated.")
    } catch (error) {
      console.error('Error creating tank:', error)
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const downloadQRCode = () => {
    if (qrCodeGenerated?.image) {
      const link = document.createElement('a')
      link.href = qrCodeGenerated.image
      link.download = `${qrCodeGenerated.code}.png`
      link.click()
    }
  }

  const proceedToPayment = () => {
    if (qrCodeGenerated) {
      router.push(`/payment?qrcode=${qrCodeGenerated.id}`)
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
    router.push('/auth/signin')
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
                <span className="text-xl font-bold text-gray-900">QR Tanki</span>
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
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Add New Tank
          </h1>
          <p className="text-gray-600">
            Register your water tank and generate a unique QR code
          </p>
        </div>

        {!qrCodeGenerated ? (
          <Card>
            <CardHeader>
              <CardTitle>Tank Information</CardTitle>
              <CardDescription>
                Please provide details about your water tank
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

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Tank Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Main Water Tank"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="type">Tank Type *</Label>
                    <Select value={formData.type} onValueChange={(value) => handleChange("type", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tank type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Overhead">Overhead</SelectItem>
                        <SelectItem value="Underground">Underground</SelectItem>
                        <SelectItem value="Sum">Sum</SelectItem>
                        <SelectItem value="Plastic">Plastic</SelectItem>
                        <SelectItem value="Concrete">Concrete</SelectItem>
                        <SelectItem value="Stainless Steel">Stainless Steel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacity</Label>
                    <Input
                      id="capacity"
                      placeholder="e.g., 1000 Liters"
                      value={formData.capacity}
                      onChange={(e) => handleChange("capacity", e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="installationDate">Installation Date</Label>
                    <Input
                      id="installationDate"
                      type="date"
                      value={formData.installationDate}
                      onChange={(e) => handleChange("installationDate", e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Textarea
                    id="location"
                    placeholder="e.g., Rooftop - Building A, Apartment 101"
                    value={formData.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                    required
                    disabled={loading}
                    rows={3}
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <QrCode className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">QR Code Generation</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        A unique QR code with printable sticker will be generated for your tank. 
                        One-time payment of ₹499 applicable for QR code sticker generation.
                        Annual renewal of ₹199/year for continued service.
                      </p>
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating Tank..." : "Create Tank & Generate QR Code"}
                </Button>
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
                <CardTitle className="text-2xl">Tank Created Successfully!</CardTitle>
                <CardDescription>
                  Your tank has been registered and QR code generated
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-lg">
                    <img 
                      src={qrCodeGenerated.image} 
                      alt={`QR Code ${qrCodeGenerated.code}`}
                      className="w-64 h-64 mx-auto"
                    />
                  </div>
                  <div className="mt-4">
                    <p className="font-mono text-lg font-medium">{qrCodeGenerated.code}</p>
                    <p className="text-sm text-gray-600 mt-1">Your unique tank QR code</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    onClick={downloadQRCode}
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download QR Code
                  </Button>
                  <Button 
                    onClick={proceedToPayment}
                    className="w-full"
                    disabled={qrCodeGenerated.isPaid}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    {qrCodeGenerated.isPaid ? "Payment Completed" : "Pay ₹499"}
                  </Button>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-900 mb-2">Next Steps:</h4>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>1. Complete the payment of ₹499 to activate your QR code</li>
                    <li>2. Download and print the QR code sticker</li>
                    <li>3. Stick the QR code on your tank</li>
                    <li>4. Scan anytime to view tank details and cleaning history</li>
                    <li>5. Annual renewal of ₹199/year for continued tracking</li>
                  </ul>
                </div>

                <div className="text-center">
                  <Link href="/dashboard">
                    <Button variant="outline">
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