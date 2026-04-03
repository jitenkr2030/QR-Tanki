// Payment Page for QR Tanki Platform
// Handles both Cash and UPI payment options for QR Codes and Subscriptions

'use client'

import { useState, useEffect, Suspense } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  CreditCard, 
  Smartphone, 
  DollarSign, 
  CheckCircle, 
  AlertCircle, 
  ArrowLeft,
  Download,
  QrCode,
  Clock,
  Shield,
  User,
  Calendar,
  MapPin,
  Droplets
} from "lucide-react"

interface Tank {
  id: string
  name: string
  type: string
  capacity?: string
  location: string
  qrCode: {
    id: string
    code: string
    isPaid: boolean
    isGenerated: boolean
  }
}

interface Subscription {
  id: string
  plan: string
  amount: number
  billingCycle: string
  startDate: string
  endDate: string
  isActive: boolean
  cleaningFrequency: number
}

interface PaymentData {
  paymentMethod: 'cash' | 'upi'
  amount: number
  transactionId?: string
  paymentProof?: string
  notes?: string
  customerName: string
  customerPhone: string
  customerEmail: string
}

function PaymentContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const qrCodeId = searchParams.get('qrcode')
  const tankId = searchParams.get('tankId')
  const subscriptionId = searchParams.get('subscription')
  const billingCycle = searchParams.get('billingCycle') || 'monthly'
  
  const [tank, setTank] = useState<Tank | null>(null)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [paymentProcessing, setPaymentProcessing] = useState(false)
  const [paymentCompleted, setPaymentCompleted] = useState(false)
  const [paymentData, setPaymentData] = useState<PaymentData>({
    paymentMethod: 'upi',
    amount: 499,
    transactionId: '',
    paymentProof: '',
    notes: '',
    customerName: '',
    customerPhone: '',
    customerEmail: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

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

    loadPaymentData()
  }, [session, status, router, qrCodeId, tankId, subscriptionId, billingCycle])

  const loadPaymentData = async () => {
    try {
      // Load data based on payment type
      if (qrCodeId && tankId) {
        // QR Code payment
        const mockTank: Tank = {
          id: tankId || '1',
          name: "Main Water Tank",
          type: "OVERHEAD",
          capacity: "1000 Liters",
          location: "Rooftop - Building A",
          qrCode: {
            id: qrCodeId || 'qr-123',
            code: "QT-123456",
            isPaid: false,
            isGenerated: true
          }
        }
        setTank(mockTank)
        setPaymentData(prev => ({
          ...prev,
          amount: 499,
          customerName: session.user.name,
          customerEmail: session.user.email || '',
          customerPhone: '+91 98765 43211'
        }))
      } else if (subscriptionId) {
        // Subscription payment
        const plan = billingCycle === 'monthly' ? 'BASIC' : 'BASIC' // Mock plan
        const amount = billingCycle === 'monthly' ? 99 : 999
        
        const mockSubscription: Subscription = {
          id: subscriptionId,
          plan: plan,
          amount: amount,
          billingCycle: billingCycle,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + (billingCycle === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000).toISOString(),
          isActive: false,
          cleaningFrequency: 2
        }
        setSubscription(mockSubscription)
        setPaymentData(prev => ({
          ...prev,
          amount: amount,
          customerName: session.user.name,
          customerEmail: session.user.email || '',
          customerPhone: '+91 98765 43211'
        }))
      }
    } catch (error) {
      console.error("Failed to load payment data:", error)
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!paymentData.customerName.trim()) {
      newErrors.customerName = "Customer name is required"
    }

    if (!paymentData.customerPhone.trim()) {
      newErrors.customerPhone = "Phone number is required"
    }

    if (paymentData.paymentMethod === 'upi') {
      if (!paymentData.transactionId.trim()) {
        newErrors.transactionId = "Transaction ID is required for UPI payment"
      }
    }

    if (paymentData.paymentMethod === 'cash') {
      if (!paymentData.paymentProof.trim()) {
        newErrors.paymentProof = "Payment proof (receipt number) is required for cash payment"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setPaymentProcessing(true)

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))

      // In a real implementation, you would:
      // 1. Save payment data to database
      // 2. Update QR code or subscription status
      // 3. Send confirmation email
      // 4. Notify admin for verification

      setPaymentCompleted(true)
    } catch (error) {
      console.error("Payment processing failed:", error)
    } finally {
      setPaymentProcessing(false)
    }
  }

  const downloadQRCode = () => {
    if (!tank) return

    // Generate QR code image
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(tank.qrCode.code)}&format=png&margin=10&color=000000&bgcolor=FFFFFF`
    
    const link = document.createElement('a')
    link.href = qrCodeUrl
    link.download = `${tank.qrCode.code}.png`
    link.click()
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getPaymentType = () => {
    if (tank) return 'QR Code'
    if (subscription) return 'Subscription'
    return 'Payment'
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

  if (paymentCompleted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/dashboard" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Droplets className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">QR Tanki</span>
              </Link>
              <Button variant="outline" asChild>
                <Link href="/dashboard">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-2xl">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Payment Successful!</CardTitle>
              <CardDescription>
                Your {getPaymentType().toLowerCase()} payment has been received and is being processed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-2">Payment Details:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Type:</span>
                    <span className="font-medium">{getPaymentType()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium capitalize">{paymentData.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium">{formatAmount(paymentData.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-medium">{paymentData.transactionId || 'Cash Payment'}</span>
                  </div>
                  {tank && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tank:</span>
                      <span className="font-medium">{tank.name}</span>
                    </div>
                  )}
                  {subscription && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Plan:</span>
                      <span className="font-medium">{subscription.plan} ({subscription.billingCycle})</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Next Steps:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>1. Your payment is being verified by our team</li>
                  <li>2. Service activation will be done within 24 hours</li>
                  <li>3. You will receive a confirmation email</li>
                  {tank && (
                    <>
                      <li>4. Download your QR code sticker below</li>
                      <li>5. Stick the QR code on your tank for tracking</li>
                    </>
                  )}
                  {subscription && (
                    <>
                      <li>4. Your subscription will be activated after verification</li>
                      <li>5. You can start booking cleaning services</li>
                    </>
                  )}
                </ul>
              </div>

              {tank && (
                <div className="text-center">
                  <Button onClick={downloadQRCode} className="w-full" size="lg">
                    <Download className="w-4 h-4 mr-2" />
                    Download QR Code Sticker
                  </Button>
                  <p className="text-sm text-gray-600 mt-2">
                    Download and print the QR code sticker to put on your tank
                  </p>
                </div>
              )}

              <div className="text-center">
                <Button variant="outline" asChild className="w-full">
                  <Link href="/dashboard">
                    Go to Dashboard
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
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
            <Button variant="outline" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Payment Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <QrCode className="w-5 h-5 mr-2" />
              {getPaymentType()} Payment
            </CardTitle>
            <CardDescription>
              Complete the payment to activate your {getPaymentType().toLowerCase()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {tank && (
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Tank Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Droplets className="w-4 h-4 mr-2 text-gray-500" />
                      <span>{tank.name}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                      <span>{tank.location}</span>
                    </div>
                    <div className="flex items-center">
                      <QrCode className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="font-mono">{tank.qrCode.code}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Payment Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-bold text-lg">{formatAmount(paymentData.amount)}</span>
                    </div>
                    <div className="flex items-center">
                      <Shield className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="text-green-600">Secure Payment</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {subscription && (
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Subscription Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <CreditCard className="w-4 h-4 mr-2 text-gray-500" />
                      <span>{subscription.plan} Plan</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                      <span>{subscription.billingCycle} Billing</span>
                    </div>
                    <div className="flex items-center">
                      <Droplets className="w-4 h-4 mr-2 text-gray-500" />
                      <span>{subscription.cleaningFrequency} cleaning/month</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Payment Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-bold text-lg">{formatAmount(paymentData.amount)}</span>
                    </div>
                    <div className="flex items-center">
                      <Shield className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="text-green-600">Secure Payment</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Form */}
        <Card>
          <CardHeader>
            <CardTitle>Select Payment Method</CardTitle>
            <CardDescription>
              Choose your preferred payment method
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Payment Method Selection */}
              <div>
                <Label className="text-base font-medium">Payment Method</Label>
                <RadioGroup 
                  value={paymentData.paymentMethod} 
                  onValueChange={(value: 'cash' | 'upi') => 
                    setPaymentData(prev => ({ ...prev, paymentMethod: value }))
                  }
                  className="mt-3"
                >
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <RadioGroupItem value="upi" id="upi" />
                    <Label htmlFor="upi" className="flex items-center cursor-pointer flex-1">
                      <Smartphone className="w-5 h-5 mr-3 text-blue-600" />
                      <div>
                        <div className="font-medium">UPI Payment</div>
                        <div className="text-sm text-gray-500">Pay using UPI apps</div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="flex items-center cursor-pointer flex-1">
                      <DollarSign className="w-5 h-5 mr-3 text-green-600" />
                      <div>
                        <div className="font-medium">Cash Payment</div>
                        <div className="text-sm text-gray-500">Pay in cash</div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* UPI Payment Details */}
              {paymentData.paymentMethod === 'upi' && (
                <div className="space-y-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-3">UPI Payment Details</h4>
                  
                  <div className="bg-white p-4 rounded-lg border border-blue-300">
                    <div className="text-center mb-3">
                      <p className="text-sm text-gray-600 mb-2">Scan to pay with UPI</p>
                      <div className="inline-block p-2 bg-white border-2 border-gray-300 rounded">
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=9871087168@kotak&pn=QR%20Tanki&am=${paymentData.amount * 100}&cu=INR&tn=${encodeURIComponent(getPaymentType())}%20Payment&tr=${tank?.qrCode.code || subscription?.id || 'payment'}&format=png&margin=10`}
                          alt="UPI QR Code"
                          className="w-48 h-48"
                        />
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">UPI ID: 9871087168@kotak</p>
                      <p className="text-xs text-gray-600">QR Tanki Services</p>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="transactionId">Transaction ID *</Label>
                    <Input
                      id="transactionId"
                      placeholder="Enter your UPI transaction ID"
                      value={paymentData.transactionId}
                      onChange={(e) => setPaymentData(prev => ({ ...prev, transactionId: e.target.value }))}
                      className={errors.transactionId ? 'border-red-500' : ''}
                    />
                    {errors.transactionId && (
                      <p className="text-sm text-red-500 mt-1">{errors.transactionId}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Cash Payment Details */}
              {paymentData.paymentMethod === 'cash' && (
                <div className="space-y-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-3">Cash Payment Details</h4>
                  
                  <div className="bg-white p-4 rounded-lg border border-green-300">
                    <div className="text-center">
                      <DollarSign className="w-12 h-12 text-green-600 mx-auto mb-2" />
                      <p className="font-medium text-gray-900">Cash Payment</p>
                      <p className="text-sm text-gray-600">Pay in cash and get receipt</p>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="paymentProof">Receipt Number *</Label>
                    <Input
                      id="paymentProof"
                      placeholder="Enter cash receipt number"
                      value={paymentData.paymentProof}
                      onChange={(e) => setPaymentData(prev => ({ ...prev, paymentProof: e.target.value }))}
                      className={errors.paymentProof ? 'border-red-500' : ''}
                    />
                    {errors.paymentProof && (
                      <p className="text-sm text-red-500 mt-1">{errors.paymentProof}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Customer Information */}
              <div className="space-y-4">
                <h4 className="font-medium">Customer Information</h4>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customerName">Full Name *</Label>
                    <Input
                      id="customerName"
                      placeholder="Enter your full name"
                      value={paymentData.customerName}
                      onChange={(e) => setPaymentData(prev => ({ ...prev, customerName: e.target.value }))}
                      className={errors.customerName ? 'border-red-500' : ''}
                    />
                    {errors.customerName && (
                      <p className="text-sm text-red-500 mt-1">{errors.customerName}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="customerPhone">Phone Number *</Label>
                    <Input
                      id="customerPhone"
                      placeholder="Enter your phone number"
                      value={paymentData.customerPhone}
                      onChange={(e) => setPaymentData(prev => ({ ...prev, customerPhone: e.target.value }))}
                      className={errors.customerPhone ? 'border-red-500' : ''}
                    />
                    {errors.customerPhone && (
                      <p className="text-sm text-red-500 mt-1">{errors.customerPhone}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="customerEmail">Email Address</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    placeholder="Enter your email address"
                    value={paymentData.customerEmail}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, customerEmail: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional information or special instructions"
                    value={paymentData.notes}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                  />
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium mb-2">Payment Terms</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Payment verification will be done within 24 hours</li>
                  <li>• Service activation will be done after payment verification</li>
                  <li>• You will receive confirmation via email and phone</li>
                  {tank && <li>• QR code sticker can be downloaded after payment</li>}
                  {subscription && <li>• Subscription will be activated after verification</li>}
                  <li>• For any queries, contact our support team</li>
                </ul>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={paymentProcessing}
              >
                {paymentProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Pay {formatAmount(paymentData.amount)}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

// Loading fallback component
function PaymentLoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
    </div>
  )
}

// Main component with Suspense boundary
export default function PaymentPage() {
  return (
    <Suspense fallback={<PaymentLoadingFallback />}>
      <PaymentContent />
    </Suspense>
  )
}