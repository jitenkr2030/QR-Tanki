'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  QrCode, 
  Search, 
  Droplets, 
  Calendar, 
  Star, 
  User, 
  MapPin,
  AlertCircle,
  CheckCircle,
  Clock,
  Shield
} from "lucide-react"
import Link from "next/link"

interface TankData {
  tank: {
    id: string
    name: string
    type: string
    capacity?: string
    location: string
    installationDate?: string
    lastCleanedDate?: string
    nextDueDate?: string
    hygieneScore?: number
    owner: {
      name: string
      phone?: string
    }
  }
  cleaningHistory: Array<{
    id: string
    cleaningType: string
    cleanedAt: string
    hygieneScore?: number
    cleaner: string
    notes?: string
    duration?: number
  }>
  qrCode: {
    code: string
    isPaid: boolean
    generatedAt: string
  }
}

export default function ScanPage() {
  const [qrCode, setQrCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [tankData, setTankData] = useState<TankData | null>(null)

  const handleScan = async () => {
    if (!qrCode.trim()) {
      setError("Please enter a QR code")
      return
    }

    setLoading(true)
    setError("")
    setTankData(null)

    try {
      const response = await fetch(`/api/qrcode?code=${encodeURIComponent(qrCode.trim())}`)
      const result = await response.json()

      if (!response.ok) {
        setError(result.error || "Failed to scan QR code")
        return
      }

      setTankData(result)
    } catch (error) {
      setError("An error occurred while scanning. Please try again.")
    } finally {
      setLoading(false)
    }
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
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Droplets className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">QR Tanki</span>
            </Link>
            <Link href="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Scan Tank QR Code
          </h1>
          <p className="text-gray-600">
            Enter the QR code to view tank details and cleaning history
          </p>
        </div>

        {/* Scanner Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <QrCode className="w-5 h-5 mr-2" />
              QR Code Scanner
            </CardTitle>
            <CardDescription>
              Enter the tank QR code to retrieve information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <div className="flex-1">
                <Label htmlFor="qrcode" className="sr-only">QR Code</Label>
                <Input
                  id="qrcode"
                  placeholder="Enter QR code (e.g., QT-123456)"
                  value={qrCode}
                  onChange={(e) => setQrCode(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleScan()}
                  disabled={loading}
                />
              </div>
              <Button onClick={handleScan} disabled={loading}>
                {loading ? "Scanning..." : <><Search className="w-4 h-4 mr-2" />Scan</>}
              </Button>
            </div>

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="mt-4 text-center text-sm text-gray-600">
              <p>Try scanning: <code className="bg-gray-100 px-2 py-1 rounded">QT-123456</code> or <code className="bg-gray-100 px-2 py-1 rounded">QT-789012</code></p>
            </div>
          </CardContent>
        </Card>

        {/* Tank Information */}
        {tankData && (
          <div className="space-y-6">
            {/* Tank Details */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Droplets className="w-5 h-5 mr-2" />
                    Tank Details
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant={tankData.qrCode.isPaid ? "default" : "secondary"}>
                      {tankData.qrCode.isPaid ? "Active" : "Payment Pending"}
                    </Badge>
                    <Badge variant={getHygieneScoreColor(tankData.tank.hygieneScore)}>
                      {getHygieneScoreText(tankData.tank.hygieneScore)}
                    </Badge>
                  </div>
                </div>
                <CardDescription>
                  QR Code: <span className="font-mono">{tankData.qrCode.code}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Tank Name</Label>
                      <p className="text-lg font-semibold">{tankData.tank.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Type</Label>
                      <p>{tankData.tank.type}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Capacity</Label>
                      <p>{tankData.tank.capacity || "Not specified"}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Location</Label>
                      <p className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {tankData.tank.location}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Owner</Label>
                      <p className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {tankData.tank.owner.name}
                      </p>
                      {tankData.tank.owner.phone && (
                        <p className="text-sm text-gray-600">{tankData.tank.owner.phone}</p>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Installation Date</Label>
                      <p>{formatDate(tankData.tank.installationDate)}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Last Cleaned</Label>
                      <p className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(tankData.tank.lastCleanedDate)}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Next Due</Label>
                      <p className="flex items-center text-orange-600">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatDate(tankData.tank.nextDueDate)}
                      </p>
                    </div>
                  </div>
                </div>

                {tankData.tank.hygieneScore && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Shield className="w-5 h-5 text-blue-600 mr-2" />
                        <span className="font-medium text-blue-900">Hygiene Score</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="w-5 h-5 text-yellow-500 mr-1" />
                        <span className="text-2xl font-bold text-blue-900">{tankData.tank.hygieneScore}</span>
                        <span className="text-sm text-blue-700 ml-1">/5.0</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Cleaning History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Cleaning History
                </CardTitle>
                <CardDescription>
                  Recent cleaning records for this tank
                </CardDescription>
              </CardHeader>
              <CardContent>
                {tankData.cleaningHistory.length > 0 ? (
                  <div className="space-y-4">
                    {tankData.cleaningHistory.map((record) => (
                      <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">{record.cleaningType} Cleaning</h4>
                            <p className="text-sm text-gray-600">
                              By {record.cleaner} • {formatDate(record.cleanedAt)}
                              {record.duration && ` • ${record.duration} minutes`}
                            </p>
                            {record.notes && (
                              <p className="text-sm text-gray-500 mt-1">{record.notes}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          {record.hygieneScore && (
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-yellow-500 mr-1" />
                              <span className="font-medium">{record.hygieneScore}</span>
                            </div>
                          )}
                          <p className="text-sm text-gray-600">Score</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No cleaning records found</p>
                    <p className="text-sm text-gray-500 mt-1">
                      This tank hasn't been cleaned yet
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Digital Certificate */}
            {tankData.tank.hygieneScore && tankData.tank.hygieneScore >= 3.5 && (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-green-900 mb-2">
                      Tank Clean Verified
                    </h3>
                    <p className="text-green-700 mb-4">
                      This tank meets hygiene and safety standards
                    </p>
                    <Badge className="bg-green-600 text-white">
                      Digital Certificate Valid
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  )
}