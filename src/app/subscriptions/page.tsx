'use client'

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Droplets, 
  Calendar, 
  CreditCard, 
  CheckCircle, 
  AlertCircle, 
  Star,
  TrendingUp,
  Users,
  Shield,
  Clock,
  ArrowRight
} from "lucide-react"

interface Subscription {
  id: string
  plan: string
  amount: number
  startDate: string
  endDate: string
  isActive: boolean
  autoRenew: boolean
  cleaningFrequency: number
  payments: any[]
  _count: {
    payments: number
  }
}

export default function SubscriptionsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

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

    loadSubscriptions()
  }, [session, status, router])

  const loadSubscriptions = async () => {
    try {
      const response = await fetch('/api/subscriptions')
      const result = await response.json()
      
      if (response.ok) {
        setSubscriptions(result.subscriptions)
      }
    } catch (error) {
      console.error("Failed to load subscriptions:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubscribe = async (plan: string) => {
    try {
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          plan,
          autoRenew: false
        })
      })

      const result = await response.json()

      if (!response.ok) {
        alert(result.error || 'Failed to create subscription')
        return
      }

      // Redirect to payment
      router.push(`/payment?subscription=${result.subscription.id}&billingCycle=yearly`)
    } catch (error) {
      alert("An error occurred. Please try again.")
    }
  }

  const [billingCycle, setBillingCycle] = useState<'yearly'>('yearly')

  const getPlanDetails = (plan: string) => {
    const plans = {
      BASIC: {
        name: "Basic Plan",
        monthlyPrice: 99,
        yearlyPrice: 999,
        frequency: "2 cleanings/year",
        features: [
          "2 cleanings per year",
          "Basic cleaning type",
          "Photo proof of service",
          "Email reminders",
          "Digital access to cleaning history",
          "Save ₹180 per year"
        ],
        color: "blue"
      },
      PREMIUM: {
        name: "Premium Plan", 
        monthlyPrice: 199,
        yearlyPrice: 1999,
        frequency: "2 cleanings/year",
        features: [
          "2 cleanings per year",
          "Deep cleaning included",
          "Water quality testing",
          "Priority customer support",
          "Digital certificate",
          "Advanced hygiene scoring",
          "SMS reminders",
          "Save ₹389 per year"
        ],
        color: "purple"
      }
    }
    return plans[plan as keyof typeof plans]
  }

  const getActiveSubscription = () => {
    return subscriptions.find(sub => sub.isActive)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate)
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

  const activeSubscription = getActiveSubscription()

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
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Yearly Subscription Plans
          </h1>
          <p className="text-gray-600 mb-4">
            Choose the perfect yearly plan for regular tank maintenance
          </p>
          
          {/* Billing Info */}
          <div className="flex justify-center">
            <div className="inline-flex items-center bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="text-center">
                <p className="text-sm font-medium text-green-800">Yearly Billing Only</p>
                <p className="text-xs text-green-600">Pay once for 12 months of service</p>
              </div>
            </div>
          </div>
        </div>

        {activeSubscription && (
          <Alert className="mb-8 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="flex items-center justify-between">
                <div>
                  <strong>Active Subscription:</strong> {getPlanDetails(activeSubscription.plan)?.name}
                  <span className="ml-4">Expires: {formatDate(activeSubscription.endDate)}</span>
                  <span className="ml-4">({getDaysRemaining(activeSubscription.endDate)} days remaining)</span>
                </div>
                <Link href="/dashboard">
                  <Button size="sm">Manage Tanks</Button>
                </Link>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="plans" className="space-y-6">
          <TabsList>
            <TabsTrigger value="plans">Available Plans</TabsTrigger>
            <TabsTrigger value="history">Subscription History</TabsTrigger>
          </TabsList>

          <TabsContent value="plans" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {Object.entries({
                BASIC: { badge: "Popular", highlighted: true },
                PREMIUM: { badge: "Best Value", highlighted: false }
              }).map(([plan, config]) => {
                const planDetails = getPlanDetails(plan)
                const isPlanActive = activeSubscription?.plan === plan
                
                return (
                  <Card key={plan} className={`relative ${config.highlighted ? 'border-2 border-blue-500' : ''}`}>
                    {config.badge && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-blue-500 text-white">
                          {config.badge}
                        </Badge>
                      </div>
                    )}
                    
                    <CardHeader className="text-center">
                      <CardTitle className="text-2xl">{planDetails?.name}</CardTitle>
                      <div className="text-3xl font-bold">
                        ₹{planDetails?.yearlyPrice}
                        <span className="text-lg font-normal text-gray-600">/year</span>
                      </div>
                      <CardDescription>
                        {planDetails?.frequency} (₹{planDetails?.monthlyPrice}/month displayed)
                      </CardDescription>
                      <div className="mt-2">
                        <Badge className="bg-green-100 text-green-800">
                          Save ₹{plan === 'BASIC' ? '790' : '1,189'} per year
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                      <ul className="space-y-3">
                        {planDetails?.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="space-y-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-medium mb-2">What's Included:</h4>
                          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              Scheduled cleaning
                            </div>
                            <div className="flex items-center">
                              <Star className="w-4 h-4 mr-1" />
                              Hygiene scoring
                            </div>
                            <div className="flex items-center">
                              <Shield className="w-4 h-4 mr-1" />
                              Quality assurance
                            </div>
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              Professional cleaners
                            </div>
                          </div>
                        </div>

                        {isPlanActive ? (
                          <Button disabled className="w-full">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Current Plan
                          </Button>
                        ) : activeSubscription ? (
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => alert('Please cancel your current subscription first')}
                          >
                            Switch Plan
                          </Button>
                        ) : (
                          <Button 
                            className="w-full"
                            onClick={() => handleSubscribe(plan)}
                          >
                            <CreditCard className="w-4 h-4 mr-2" />
                            Subscribe Now
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <div className="mt-12 text-center">
              <h3 className="text-2xl font-bold mb-4">Need a One-Time Service?</h3>
              <p className="text-gray-600 mb-6">
                Don't want a subscription? Book a single cleaning service instead.
              </p>
              <Link href="/bookings/new">
                <Button variant="outline" size="lg">
                  <Calendar className="w-4 h-4 mr-2" />
                  Book One-Time Cleaning
                </Button>
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Subscription History</CardTitle>
                <CardDescription>
                  Your past and current subscription records
                </CardDescription>
              </CardHeader>
              <CardContent>
                {subscriptions.length > 0 ? (
                  <div className="space-y-4">
                    {subscriptions.map((subscription) => {
                      const planDetails = getPlanDetails(subscription.plan)
                      const isActive = subscription.isActive
                      
                      return (
                        <div key={subscription.id} className="border rounded-lg p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-semibold">{planDetails?.name}</h3>
                              <p className="text-sm text-gray-600">
                                {formatDate(subscription.startDate)} - {formatDate(subscription.endDate)}
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge variant={isActive ? "default" : "secondary"}>
                                {isActive ? "Active" : "Expired"}
                              </Badge>
                              <p className="text-sm text-gray-600 mt-1">
                                ₹{subscription.amount}/month
                              </p>
                            </div>
                          </div>
                          
                          <div className="grid md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Cleaning Frequency:</span>
                              <p>{subscription.cleaningFrequency} per month</p>
                            </div>
                            <div>
                              <span className="font-medium">Auto-Renewal:</span>
                              <p>{subscription.autoRenew ? "Enabled" : "Disabled"}</p>
                            </div>
                            <div>
                              <span className="font-medium">Payments Made:</span>
                              <p>{subscription._count.payments}</p>
                            </div>
                          </div>

                          {isActive && (
                            <div className="mt-4 pt-4 border-t">
                              <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-600">
                                  <Clock className="w-4 h-4 inline mr-1" />
                                  {getDaysRemaining(subscription.endDate)} days remaining
                                </div>
                                <Button size="sm" variant="outline">
                                  Manage Subscription
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No subscription history found</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Subscribe to a plan to get started with regular tank cleaning
                    </p>
                    <div className="mt-4">
                      <Link href="#plans">
                        <Button>View Plans</Button>
                      </Link>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}