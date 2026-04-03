// Help Center Page for QR Tanki Platform

'use client'

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Droplets, 
  Search, 
  BookOpen, 
  Video, 
  Phone, 
  Mail, 
  MessageCircle,
  HelpCircle,
  CheckCircle,
  AlertCircle,
  Clock,
  Users,
  QrCode,
  Calendar,
  Shield,
  Settings,
  CreditCard,
  MapPin
} from "lucide-react"

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const faqCategories = [
    {
      id: "getting-started",
      name: "Getting Started",
      icon: BookOpen,
      color: "blue",
      articles: [
        {
          id: 1,
          title: "How to create my first tank QR code?",
          content: "Creating your first tank QR code is simple. Follow these steps: 1) Sign up for an account, 2) Click 'Add New Tank', 3) Fill in your tank details, 4) Complete payment, 5) Download and print your QR code sticker.",
          category: "getting-started"
        },
        {
          id: 2,
          title: "What information do I need to provide?",
          content: "You'll need to provide: Tank name, type (overhead/underground), capacity, location, and contact information. Make sure the details are accurate for proper service delivery.",
          category: "getting-started"
        },
        {
          id: 3,
          title: "How does the QR code work?",
          content: "Each tank gets a unique QR code. Cleaners scan it to access tank information, record cleaning, and update hygiene scores. You can scan it too to view your tank's history.",
          category: "getting-started"
        }
      ]
    },
    {
      id: "subscriptions",
      name: "Subscriptions & Billing",
      icon: CreditCard,
      color: "green",
      articles: [
        {
          id: 4,
          title: "What subscription plans are available?",
          content: "We offer Basic Plan (₹4,999/year) and Premium Plan (₹5,999/year). Both include 12 cleanings per year. Premium plan includes additional features like water quality testing and priority support.",
          category: "subscriptions"
        },
        {
          id: 5,
          title: "How do I pay for my subscription?",
          content: "You can pay via UPI (scan QR code) or Cash (pay and get receipt). We accept all major UPI apps and provide receipt for cash payments.",
          category: "subscriptions"
        },
        {
          id: 6,
          title: "Can I change my subscription plan?",
          content: "Yes, you can upgrade or downgrade your plan. Contact our support team, and they'll help you with the process. Changes take effect at the next billing cycle.",
          category: "subscriptions"
        }
      ]
    },
    {
      id: "services",
      name: "Cleaning Services",
      icon: Droplets,
      color: "purple",
      articles: [
        {
          id: 7,
          title: "What types of cleaning do you offer?",
          content: "We offer Basic Cleaning (regular maintenance) and Deep Cleaning (thorough service). Premium plans include water quality testing and advanced hygiene scoring.",
          category: "services"
        },
        {
          id: 8,
          title: "How do I schedule a cleaning?",
          content: "You can schedule cleanings through your dashboard. Select your tank, choose preferred date/time, and book the service. You'll receive confirmation and reminders.",
          category: "services"
        },
        {
          id: 9,
          title: "What if I need emergency cleaning?",
          content: "For urgent cleaning needs, call our emergency support line at +91 8080 123456. We offer 24/7 emergency services at additional cost.",
          category: "services"
        }
      ]
    },
    {
      id: "technical",
      name: "Technical Support",
      icon: Settings,
      color: "orange",
      articles: [
        {
          id: 10,
          title: "My QR code is not scanning properly",
          content: "Ensure your QR code is clean, undamaged, and printed clearly. Try scanning from different angles and distances. If issues persist, contact support for a replacement.",
          category: "technical"
        },
        {
          id: 11,
          title: "I forgot my password. How do I reset it?",
          content: "Click 'Forgot Password' on the sign-in page. Enter your email, and we'll send you a password reset link. Follow the instructions to create a new password.",
          category: "technical"
        },
        {
          id: 12,
          title: "The app is not working on my phone",
          content: "Check if you have the latest version of the app. Clear your browser cache or app data. Ensure you have a stable internet connection. If problems continue, contact technical support.",
          category: "technical"
        }
      ]
    },
    {
      id: "account",
      name: "Account Management",
      icon: Users,
      color: "red",
      articles: [
        {
          id: 13,
          title: "How do I update my profile information?",
          content: "Go to your dashboard and click on your profile icon. Select 'Edit Profile' to update your name, email, phone number, and other personal information.",
          category: "account"
        },
        {
          id: 14,
          title: "Can I have multiple tanks on one account?",
          content: "Yes! You can add unlimited tanks to your account. Each tank gets its own QR code and cleaning history. Manage all your tanks from one dashboard.",
          category: "account"
        },
        {
          id: 15,
          title: "How do I cancel my subscription?",
          content: "To cancel, contact our support team at least 30 days before your renewal date. They'll guide you through the cancellation process and answer any questions.",
          category: "account"
        }
      ]
    }
  ]

  const filteredArticles = faqCategories.flatMap(category => 
    category.articles.filter(article => 
      selectedCategory === "all" || article.category === selectedCategory
    ).filter(article =>
      searchTerm === "" || 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  const popularArticles = [
    { id: 1, title: "How to create my first tank QR code?", views: 1234 },
    { id: 4, title: "What subscription plans are available?", views: 987 },
    { id: 7, title: "What types of cleaning do you offer?", views: 876 },
    { id: 10, title: "My QR code is not scanning properly", views: 765 }
  ]

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
              <Button variant="outline" size="sm">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Help Hero */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Help Center
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Find answers to common questions or get in touch with our support team
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search for help articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-12 px-4 bg-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold">Getting Started</h3>
                <p className="text-sm text-gray-600 mt-1">Learn the basics</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Video className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold">Video Tutorials</h3>
                <p className="text-sm text-gray-600 mt-1">Watch guides</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageCircle className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold">Live Chat</h3>
                <p className="text-sm text-gray-600 mt-1">Chat with us</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Phone className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-semibold">Call Support</h3>
                <p className="text-sm text-gray-600 mt-1">Talk to an expert</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Help Content */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <Tabs defaultValue="articles" className="space-y-8">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-6">
              <TabsTrigger value="articles" className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Articles</span>
              </TabsTrigger>
              {faqCategories.map((category) => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center space-x-2"
                >
                  <category.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{category.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="articles" className="space-y-8">
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("all")}
                >
                  All Categories
                </Button>
                {faqCategories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>

              {/* Search Results */}
              {filteredArticles.length > 0 ? (
                <div className="space-y-4">
                  {filteredArticles.map((article) => (
                    <Card key={article.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-lg font-semibold text-gray-900 flex-1">
                            {article.title}
                          </h3>
                          <Badge variant="outline" className="text-xs">
                            {faqCategories.find(c => c.id === article.category)?.name}
                          </Badge>
                        </div>
                        <p className="text-gray-600 leading-relaxed">
                          {article.content}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No articles found
                  </h3>
                  <p className="text-gray-600">
                    Try searching with different keywords or browse all categories
                  </p>
                </div>
              )}
            </TabsContent>

            {faqCategories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="space-y-4">
                {category.articles.map((article) => (
                  <Card key={article.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {article.content}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-12 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Popular Articles
            </h2>
            <p className="text-gray-600">
              Most viewed help articles by our users
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {popularArticles.map((article) => (
              <Card key={article.id} className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">
                      {article.title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <HelpCircle className="w-4 h-4 mr-1" />
                      {article.views} views
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Still Need Help?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our support team is here to help you 24/7
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="border-0 shadow-lg text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Live Chat</h3>
                <p className="text-gray-600 mb-4">
                  Chat with our support team in real-time
                </p>
                <Button className="w-full">
                  Start Chat
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Email Support</h3>
                <p className="text-gray-600 mb-4">
                  Send us an email and we'll respond within 24 hours
                </p>
                <Button variant="outline" className="w-full">
                  support@qrtanki.com
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Phone Support</h3>
                <p className="text-gray-600 mb-4">
                  Call us for immediate assistance
                </p>
                <Button variant="outline" className="w-full">
                  +91 8080 123456
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <div className="inline-flex items-center space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              <span className="text-blue-800">
                <strong>Emergency Support:</strong> Available 24/7 for urgent water tank issues
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center">
            <p>&copy; 2024 QR Tanki. All rights reserved.</p>
            <div className="mt-4 flex justify-center space-x-6">
              <Link href="/privacy" className="hover:text-blue-400">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-blue-400">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}