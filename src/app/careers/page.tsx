// Careers Page for QR Tanki Platform

'use client'

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Droplets, 
  Users, 
  MapPin, 
  Send,
  Briefcase,
  Heart,
  Award,
  Target,
  Shield,
  Clock,
  CheckCircle,
  Building,
  TrendingUp
} from "lucide-react"

export default function CareersPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    experience: "",
    message: "",
    resume: ""
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In a real implementation, you would:
      // 1. Send application data to your backend API
      // 2. Send email notification to HR
      // 3. Store application in database
      // 4. Handle resume upload
      
      setSubmitted(true)
    } catch (error) {
      setError("Failed to submit application. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError("")
  }

  const openPositions = [
    {
      id: 1,
      title: "Senior Water Tank Cleaning Specialist",
      department: "Operations",
      location: "Bangalore",
      type: "Full-time",
      experience: "3-5 years",
      description: "Lead cleaning operations and train junior cleaners",
      requirements: [
        "3+ years of water tank cleaning experience",
        "Knowledge of water treatment and hygiene",
        "Leadership and training skills",
        "Valid driver's license"
      ]
    },
    {
      id: 2,
      title: "Customer Success Manager",
      department: "Customer Success",
      location: "Bangalore",
      type: "Full-time",
      experience: "2-4 years",
      description: "Manage customer relationships and ensure satisfaction",
      requirements: [
        "2+ years in customer service",
        "Excellent communication skills",
        "Problem-solving abilities",
        "Experience with CRM systems"
      ]
    },
    {
      id: 3,
      title: "Field Service Executive",
      department: "Operations",
      location: "Multiple Cities",
      type: "Full-time",
      experience: "1-3 years",
      description: "Provide on-site cleaning services and customer support",
      requirements: [
        "1+ years in field service",
        "Good physical fitness",
        "Two-wheeler driving license",
        "Willingness to travel"
      ]
    },
    {
      id: 4,
      title: "Marketing Manager",
      department: "Marketing",
      location: "Bangalore",
      type: "Full-time",
      experience: "3-5 years",
      description: "Lead marketing initiatives and brand growth",
      requirements: [
        "3+ years in marketing management",
        "Digital marketing expertise",
        "Team leadership experience",
        "MBA preferred"
      ]
    },
    {
      id: 5,
      title: "Junior Software Developer",
      department: "Technology",
      location: "Bangalore",
      type: "Full-time",
      experience: "0-2 years",
      description: "Develop and maintain our web and mobile applications",
      requirements: [
        "B.Tech/MCA in Computer Science",
        "Knowledge of React/Next.js",
        "Basic understanding of databases",
        "Strong problem-solving skills"
      ]
    },
    {
      id: 6,
      title: "Business Development Executive",
      department: "Sales",
      location: "Bangalore",
      type: "Full-time",
      experience: "2-4 years",
      description: "Drive business growth and acquire new customers",
      requirements: [
        "2+ years in sales/business development",
        "Excellent communication skills",
        "Network in real estate/water industry",
        "Target-driven mindset"
      ]
    }
  ]

  const benefits = [
    {
      icon: Heart,
      title: "Health & Wellness",
      description: "Comprehensive health insurance and wellness programs"
    },
    {
      icon: Award,
      title: "Professional Growth",
      description: "Continuous learning opportunities and skill development"
    },
    {
      icon: Target,
      title: "Performance Bonus",
      description: "Attractive performance-based bonuses and incentives"
    },
    {
      icon: Shield,
      title: "Job Security",
      description: " Stable, growing company with long-term opportunities"
    },
    {
      icon: Users,
      title: "Great Team",
      description: "Work with passionate, talented professionals"
    },
    {
      icon: Building,
      title: "Modern Office",
      description: "State-of-the-art office with great amenities"
    }
  ]

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b">
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

        {/* Success Message */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Application Submitted Successfully!
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Thank you for your interest in joining QR Tanki. We'll review your application 
                and get back to you within 5-7 business days.
              </p>
              <div className="space-y-4">
                <Link href="/">
                  <Button size="lg" className="w-full">
                    Back to Home
                  </Button>
                </Link>
                <button
                  onClick={() => {
                    setSubmitted(false)
                    setFormData({
                      name: "",
                      email: "",
                      phone: "",
                      position: "",
                      experience: "",
                      message: "",
                      resume: ""
                    })
                  }}
                  className="w-full"
                >
                  <Button variant="outline" size="lg" className="w-full">
                    Apply for Another Position
                  </Button>
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
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

      {/* Careers Hero */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Careers at <span className="text-blue-600">QR Tanki</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Join our mission to revolutionize water tank management in India. 
            We're looking for passionate individuals who want to make a difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="#open-positions">
              <Button size="lg" className="text-lg px-6 py-4">
                View Open Positions
              </Button>
            </Link>
            <Link href="#culture">
              <Button size="lg" variant="outline" className="text-lg px-6 py-4">
                Learn About Our Culture
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Join Us */}
      <section id="culture" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Join QR Tanki?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We offer more than just a job - we offer a career with purpose
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <benefit.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="open-positions" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Open Positions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're always looking for talented people to join our team
            </p>
          </div>

          <div className="space-y-6 max-w-4xl mx-auto">
            {openPositions.map((position) => (
              <Card key={position.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{position.title}</CardTitle>
                      <CardDescription className="mb-4">{position.description}</CardDescription>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">{position.type}</Badge>
                        <Badge variant="outline">{position.location}</Badge>
                        <Badge variant="outline">{position.experience}</Badge>
                      </div>
                    </div>
                    <div className="ml-4">
                      <Badge className="bg-blue-100 text-blue-800">
                        {position.department}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Requirements:</h4>
                    <ul className="space-y-1">
                      {position.requirements.map((req, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button 
                    onClick={() => {
                      setFormData(prev => ({ ...prev, position: position.title }))
                      document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="w-full"
                  >
                    Apply Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Don't see a position that fits? We're always looking for talented people.
            </p>
            <Button variant="outline" size="lg">
              Send Open Application
            </Button>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="application-form" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Apply to Join Our Team
            </h2>
            <p className="text-xl text-gray-600">
              Fill out the form below and we'll get back to you soon
            </p>
          </div>

          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="position">Position *</Label>
                    <Input
                      id="position"
                      placeholder="Position you're applying for"
                      value={formData.position}
                      onChange={(e) => handleChange("position", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience *</Label>
                  <Input
                    id="experience"
                    placeholder="e.g., 2-3 years"
                    value={formData.experience}
                    onChange={(e) => handleChange("experience", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Cover Letter *</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us why you'd be a great fit for QR Tanki..."
                    value={formData.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    rows={5}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="resume">Resume/CV *</Label>
                  <Input
                    id="resume"
                    type="file"
                    placeholder="Upload your resume (PDF, DOC, DOCX)"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleChange("resume", e.target.files[0]?.name || "")}
                    required
                  />
                  <p className="text-sm text-gray-500">
                    Accepted formats: PDF, DOC, DOCX (Max 5MB)
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting Application...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Application
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Life at QR Tanki */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Life at QR Tanki
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience our vibrant, innovative work culture
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Growth Opportunities</h3>
              <p className="text-gray-600">
                Learn new skills, take on challenges, and grow with us
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Great Team</h3>
              <p className="text-gray-600">
                Work with passionate, talented professionals from diverse backgrounds
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Work-Life Balance</h3>
              <p className="text-gray-600">
                Flexible work arrangements and focus on employee well-being
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join us in our mission to provide clean water for every Indian household
          </p>
          <Link href="#open-positions">
            <Button size="lg" variant="secondary" className="text-lg px-6 py-4">
              View Open Positions
            </Button>
          </Link>
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