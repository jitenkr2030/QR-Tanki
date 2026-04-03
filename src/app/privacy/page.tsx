// Privacy Policy Page for QR Tanki Platform

'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Droplets, 
  Shield, 
  Eye, 
  Lock,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  FileText
} from "lucide-react"

export default function PrivacyPage() {
  const lastUpdated = "January 1, 2024"

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

      {/* Privacy Policy Hero */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="container mx-auto text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
          <p className="text-sm text-gray-500">
            Last updated: {lastUpdated}
          </p>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <Card className="border-0 shadow-lg mb-8">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
                <p className="text-gray-600 mb-4">
                  We collect information to provide better services to all our users. The types of information we collect include:
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Personal Information</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Name, email address, phone number</li>
                  <li>Physical address and location data</li>
                  <li>Profile information and preferences</li>
                  <li>Payment and billing information</li>
                  <li>Government-issued identifiers (when required)</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Tank Information</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Tank details (type, capacity, location)</li>
                  <li>QR code assignments and tracking data</li>
                  <li>Cleaning history and maintenance records</li>
                  <li>Hygiene scores and water quality data</li>
                  <li>Photos and documentation of cleaning services</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Usage Information</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>How you use our website and mobile app</li>
                  <li>Pages visited and time spent</li>
                  <li>Device information and browser type</li>
                  <li>IP address and location data</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg mb-8">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
                <p className="text-gray-600 mb-4">
                  We use the information we collect to provide, maintain, protect, and improve our services:
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Service Provision</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Create and manage your tank QR codes</li>
                  <li>Schedule and track cleaning services</li>
                  <li>Process payments and manage subscriptions</li>
                  <li>Send service reminders and notifications</li>
                  <li>Generate reports and certificates</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Communication</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Respond to your questions and provide support</li>
                  <li>Send updates about your services</li>
                  <li>Share promotional offers (with your consent)</li>
                  <li>Conduct surveys to improve our services</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Analytics and Improvement</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Analyze usage patterns to improve our services</li>
                  <li>Develop new features and functionalities</li>
                  <li>Ensure platform security and performance</li>
                  <li>Comply with legal and regulatory requirements</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg mb-8">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4">3. Information Sharing</h2>
                <p className="text-gray-600 mb-4">
                  We do not sell, trade, or otherwise transfer your personal information to third parties, except in the following circumstances:
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Service Providers</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li><strong>Cleaning Professionals:</strong> Assigned cleaners can access your tank location and cleaning history</li>
                  <li><strong>Payment Processors:</strong> We share payment information with secure payment gateways</li>
                  <li><strong>Cloud Services:</strong> We use trusted cloud providers to store and process your data</li>
                  <li><strong>Communication Services:</strong> Email and SMS services for notifications</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Legal Requirements</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>When required by law, court order, or government regulation</li>
                  <li>To protect our rights, property, or safety</li>
                  <li>To investigate or prevent illegal activities</li>
                  <li>To protect against legal claims</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Business Transfers</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>In case of merger, acquisition, or sale of assets</li>
                  <li>Your information will be transferred to the acquiring entity</li>
                  <li>You will be notified of any such transfer</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg mb-8">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4">4. Data Security</h2>
                <p className="text-gray-600 mb-4">
                  We implement appropriate technical and organizational measures to protect your personal information:
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Security Measures</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li><strong>Encryption:</strong> All data is encrypted in transit and at rest</li>
                  <li><strong>Access Control:</strong> Strict access controls and authentication systems</li>
                  <li><strong>Regular Audits:</strong> Regular security assessments and penetration testing</li>
                  <li><strong>Employee Training:</strong> All staff trained on data protection practices</li>
                  <li><strong>Secure Infrastructure:</strong> Enterprise-grade security infrastructure</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Data Retention</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>We retain your information only as long as necessary</li>
                  <li>Account data is retained while your account is active</li>
                  <li>Cleaning records are kept for compliance and quality purposes</li>
                  <li>Payment records are retained for tax and legal requirements</li>
                  <li>You can request deletion of your personal information</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg mb-8">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4">5. Your Rights</h2>
                <p className="text-gray-600 mb-4">
                  You have the following rights regarding your personal information:
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Access and Correction</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li><strong>Right to Access:</strong> Request a copy of your personal information</li>
                  <li><strong>Right to Correct:</strong> Update inaccurate or incomplete information</li>
                  <li><strong>Right to Delete:</strong> Request deletion of your personal information</li>
                  <li><strong>Right to Port:</strong> Request transfer of your data to another service</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Control and Choices</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li><strong>Marketing Communications:</strong> Opt out of promotional emails</li>
                  <li><strong>Cookies:</strong> Control browser cookies and tracking preferences</li>
                  <li><strong>Location Data:</strong> Control location sharing and tracking</li>
                  <li><strong>Profile Visibility:</strong> Control who can see your tank information</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">How to Exercise Your Rights</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Email us at privacy@qrtanki.com</li>
                  <li>Call our support team at +91 8080 123456</li>
                  <li>Use your account settings to manage preferences</li>
                  <li>Submit a data subject request through our help center</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg mb-8">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4">6. Children's Privacy</h2>
                <p className="text-gray-600 mb-4">
                  Our services are not intended for children under 13 years of age. We do not knowingly collect 
                  personal information from children under 13. If we become aware that we have collected 
                  personal information from a child under 13, we take steps to delete such information immediately.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Parental Control</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Parents can monitor and control their children's online activities</li>
                  <li>Contact us if you believe your child has provided us with personal information</li>
                  <li>We will take appropriate steps to protect children's privacy</li>
                  <li>We may collect age information to comply with regulations</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg mb-8">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4">7. International Data Transfers</h2>
                <p className="text-gray-600 mb-4">
                  Your information may be transferred to and processed in countries other than your own. 
                  We ensure appropriate safeguards are in place for such transfers:
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Safeguards</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li><strong>Adequacy Decisions:</strong> We rely on EU Commission adequacy decisions</li>
                  <li><strong>Standard Contractual Clauses:</strong> We use EU-approved standard contractual clauses</li>
                  <li><strong>Binding Corporate Rules:</strong> We implement internal data protection policies</li>
                  <li><strong>Compliance:</strong> We comply with applicable data protection laws</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg mb-8">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4">8. Changes to This Policy</h2>
                <p className="text-gray-600 mb-4">
                  We may update this privacy policy from time to time to reflect changes in our practices, 
                  legal requirements, or business operations. We will notify you of any material changes:
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Notification Methods</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Email notification to registered users</li>
                  <li>Website banner or popup notification</li>
                  <li>In-app notification for mobile users</li>
                  <li>Posting on our website or mobile app</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Effective Date</h3>
                <p className="text-gray-600">
                  This privacy policy is effective as of {lastUpdated} and will remain in effect 
                  until replaced by a new version.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg mb-8">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4">9. Contact Us</h2>
                <p className="text-gray-600 mb-4">
                  If you have any questions about this Privacy Policy, please contact us:
                </p>
                
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <h3 className="font-semibold mb-2">Privacy-Related Inquiries</h3>
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600">
                        <Mail className="w-4 h-4 mr-2" />
                        privacy@qrtanki.com
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Phone className="w-4 h-4 mr-2" />
                        +91 8080 123456
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">General Support</h3>
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600">
                        <Mail className="w-4 h-4 mr-2" />
                        support@qrtanki.com
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        123, Tech Park, Bangalore, India
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Data Protection Officer:</strong> For data protection related matters, 
                    please contact our Data Protection Officer at dpo@qrtanki.com
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center">
            <p>&copy; 2024 QR Tanki. All rights reserved.</p>
            <div className="mt-4 flex justify-center space-x-6">
              <Link href="/terms" className="hover:text-blue-400">Terms of Service</Link>
              <Link href="/contact" className="hover:text-blue-400">Contact Us</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}