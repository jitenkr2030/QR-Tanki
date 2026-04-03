'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  User, 
  Shield, 
  Wrench, 
  Building, 
  Copy,
  CheckCircle,
  Star,
  Info
} from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { QUICK_BASIC_DEMO, BASIC_DEMO_SCENARIOS } from '@/lib/demo/basic-credentials'

export default function DemoLogin() {
  const router = useRouter()
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [loginStatus, setLoginStatus] = useState('')
  const [copiedCredentials, setCopiedCredentials] = useState('')

  const handleQuickLogin = async (type: string) => {
    const credentials = QUICK_BASIC_DEMO[type as keyof typeof QUICK_BASIC_DEMO]
    setIsLoggingIn(true)
    setLoginStatus('')
    
    try {
      const result = await signIn('credentials', {
        email: credentials.email,
        password: credentials.password,
        redirect: false
      })
      
      if (result?.error) {
        setLoginStatus('Login failed. Please try again.')
      } else if (result?.ok) {
        setLoginStatus('Login successful! Redirecting...')
        setTimeout(() => {
          router.push('/dashboard')
        }, 1000)
      }
    } catch (error) {
      setLoginStatus('An error occurred. Please try again.')
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleCopyCredentials = (type: string) => {
    const credentials = QUICK_BASIC_DEMO[type as keyof typeof QUICK_BASIC_DEMO]
    const text = `Email: ${credentials.email}\nPassword: ${credentials.password}`
    
    navigator.clipboard.writeText(text).then(() => {
      setCopiedCredentials(type)
      setTimeout(() => setCopiedCredentials(''), 2000)
    })
  }

  const handleScenarioTest = (scenarioKey: string) => {
    const scenario = BASIC_DEMO_SCENARIOS[scenarioKey as keyof typeof BASIC_DEMO_SCENARIOS]
    const credentials = QUICK_BASIC_DEMO[scenario.testAccount as keyof typeof QUICK_BASIC_DEMO]
    
    handleQuickLogin(scenario.testAccount)
  }

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'ADMIN': return <Shield className="h-5 w-5" />
      case 'USER': return <User className="h-5 w-5" />
      case 'CLEANER': return <Wrench className="h-5 w-5" />
      case 'SOCIETY': return <Building className="h-5 w-5" />
      default: return <User className="h-5 w-5" />
    }
  }

  const getAccountColor = (type: string) => {
    switch (type) {
      case 'ADMIN': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'USER': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'CLEANER': return 'bg-green-100 text-green-800 border-green-200'
      case 'SOCIETY': return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🚀 QR Tanki Demo Login
          </h1>
          <p className="text-lg text-gray-600">
            Test all platform features with our demo accounts
          </p>
        </div>

        {/* Login Status */}
        {loginStatus && (
          <Alert className={`mb-6 ${
            loginStatus.includes('successful') 
              ? 'border-green-200 bg-green-50' 
              : 'border-red-200 bg-red-50'
          }`}>
            <AlertDescription className={loginStatus.includes('successful') ? 'text-green-800' : 'text-red-800'}>
              {loginStatus}
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="quick-access" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="quick-access">Quick Access</TabsTrigger>
            <TabsTrigger value="test-scenarios">Test Scenarios</TabsTrigger>
          </TabsList>

          {/* Quick Access Tab */}
          <TabsContent value="quick-access" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(QUICK_BASIC_DEMO).map(([type, credentials]) => (
                <Card key={type} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`p-2 rounded-lg ${getAccountColor(type)}`}>
                          {getAccountIcon(type)}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{type}</CardTitle>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Demo
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500">📧</span>
                        <span className="text-gray-600 truncate">{credentials.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500">🔑</span>
                        <span className="text-gray-600">••••••••</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => handleQuickLogin(type)}
                        disabled={isLoggingIn}
                      >
                        {isLoggingIn ? 'Logging in...' : 'Login'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCopyCredentials(type)}
                        className="relative"
                      >
                        {copiedCredentials === type ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Test Scenarios Tab */}
          <TabsContent value="test-scenarios" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(BASIC_DEMO_SCENARIOS).map(([key, scenario]) => (
                <Card key={key} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Star className="h-4 w-4 text-blue-600" />
                      </div>
                      <span>{scenario.name}</span>
                    </CardTitle>
                    <CardDescription>
                      {scenario.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Test Steps:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {scenario.steps.map((step, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <span className="text-blue-600 mt-0.5">{index + 1}.</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        Test Account: <span className="font-medium">{scenario.testAccount}</span>
                      </span>
                      <Button
                        size="sm"
                        onClick={() => handleScenarioTest(key)}
                        disabled={isLoggingIn}
                      >
                        {isLoggingIn ? 'Testing...' : 'Start Test'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Account Details */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Info className="h-5 w-5" />
                <span>Demo Account Details</span>
              </CardTitle>
              <CardDescription>
                Comprehensive demo accounts for testing all platform features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">👥 User Accounts</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-blue-500" />
                      <span><strong>Regular User:</strong> 2 tanks, subscription</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Building className="h-4 w-4 text-orange-500" />
                      <span><strong>Society Manager:</strong> 5 tanks, group booking</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">🔧 Service Accounts</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-purple-500" />
                      <span><strong>Admin:</strong> Full system access and management</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Wrench className="h-4 w-4 text-green-500" />
                      <span><strong>Expert Cleaner:</strong> High rating, many jobs</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium mb-2 text-blue-900">📱 Offline Testing</h4>
                <p className="text-sm text-blue-800 mb-2">
                  Test offline functionality by disconnecting from internet after logging in. The app will continue to work with cached data and sync automatically when reconnected.
                </p>
                <div className="flex items-center space-x-2 text-sm text-blue-700">
                  <span>📴 Go offline → Test features → 🟢 Come online → Auto-sync</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}