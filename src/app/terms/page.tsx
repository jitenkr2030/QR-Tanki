// Terms of Service Page for QR Tanki Platform

'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Droplets, 
  FileText, 
  Shield, 
  Gavel,
  Calendar,
  User,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Scale,
  Eye,
  Mail,
  Phone,
  MapPin
} from "lucide-react"

export default function TermsPage() {
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

      {/* Terms Hero */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="container mx-auto text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Gavel className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Terms of Service
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4">
            These terms govern your use of QR Tanki's services. By using our platform, you agree to these terms.
          </p>
          <p className="text-sm text-gray-500">
            Last updated: {lastUpdated}
          </p>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <Card className="border-0 shadow-lg mb-8">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-600 mb-4">
                  By accessing and using QR Tanki's services, you accept and agree to be bound by these Terms of Service. 
                  If you do not agree to these terms, you may not use our services.
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Agreement</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>These terms constitute a legally binding agreement between you and QR Tanki</li>
                  <li>Your use of our services indicates your acceptance of these terms</li>
                  <li>You must be at least 18 years old or have parental consent to use our services</li>
                  <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Modifications</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>We reserve the right to modify these terms at any time</li>
                  <li>Changes will be effective immediately upon posting</li>
                  <li>Your continued use of services constitutes acceptance of modified terms</li>
                  <li>We will provide notice of material changes via email or website notification</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg mb-8">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4">2. Description of Services</h2>
                <p className="text-gray-600 mb-4">
                  QR Tanki provides a water tank management platform with the following services:
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Core Services</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li><strong>QR Code Generation:</strong> Unique QR codes for water tank identification and tracking</li>
                  <li><strong>Tank Registration:</strong> Digital registration of tank details and specifications</li>
                  <li><strong>Cleaning Services:</strong> Professional water tank cleaning and maintenance services</li>
                  <li><strong>Subscription Plans:</strong> Regular cleaning subscriptions with different service levels</li>
                  <li><strong>Digital Records:</strong> Online tracking of cleaning history and maintenance records</li>
                  <li><strong>Hygiene Scoring:</strong> Water quality and hygiene assessment services</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Service Availability</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Services are available in select cities across India</li>
                  <li>We may expand or modify service areas at our discretion</li>
                  <li>Service availability depends on cleaner availability in your area</li>
                  <li>We strive to maintain high service quality but cannot guarantee perfection</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg mb-8">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4">3. User Accounts and Responsibilities</h2>
                <p className="text-gray-600 mb-4">
                  To use our services, you must create an account and accept certain responsibilities:
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Account Creation</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>You must provide accurate, complete, and current information</li>
                  <li>You are responsible for maintaining the confidentiality of your account</li>
                  <li>You must be at least 18 years old or have parental consent</li>
                  <li>You cannot use another person's account without permission</li>
                  <li>One person or entity may maintain only one account</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">User Responsibilities</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Provide accurate tank information and location details</li>
                  <li>Ensure access to your tanks for scheduled cleaning services</li>
                  <li>Maintain your QR code stickers in good condition</li>
                  <li>Report any issues or concerns promptly</li>
                  <li>Use our services for lawful purposes only</li>
                  <li>Respect the rights and privacy of our cleaning professionals</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Account Termination</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>You may terminate your account at any time</li>
                  <li>We may suspend or terminate accounts for violations</li>
                  <li>Terminated accounts may lose access to services and data</li>
                  <li>We may retain certain information as required by law</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg mb-8">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4">4. Fees and Payment Terms</h2>
                <p className="text-gray-600 mb-4">
                  Our services are subject to fees and payment terms as outlined below:
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Service Fees</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li><strong>QR Code Generation:</strong> One-time fee of ₹499 per tank</li>
                  <li><strong>Basic Subscription:</strong> ₹4,999 per year (12 cleanings)</li>
                  <li><strong>Premium Subscription:</strong> ₹5,999 per year (12 cleanings with premium features)</li>
                  <li><strong>One-Time Cleaning:</strong> ₹699 per cleaning session</li>
                  <li><strong>Emergency Cleaning:</strong> Additional fees may apply for urgent services</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Payment Methods</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>We accept UPI payments through various payment apps</li>
                  <li>We accept cash payments with proper receipt documentation</li>
                  <li>All payments are processed in Indian Rupees (INR)</li>
                  <li>Payment processing fees may apply for certain payment methods</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Billing and Renewals</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Subscriptions are billed annually unless otherwise specified</li>
                  <li>QR code renewal is ₹199 per year after the first year</li>
                  <li>We will notify you before subscription renewals</li>
                  <li>Auto-renewal options are available for subscriptions</li>
                  <li>Refunds are provided as per our refund policy</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg mb-8">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4">5. Service Standards and Quality</h2>
                <p className="text-gray-600 mb-4">
                  We are committed to providing high-quality services and maintaining certain standards:
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Service Quality</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>All cleaning professionals are trained and verified</li>
                  <li>We use industry-standard cleaning equipment and materials</li>
                  <li>Cleaning services follow established hygiene and safety protocols</li>
                  <li>We provide photo documentation of completed cleaning services</li>
                  <li>Hygiene scores are based on standardized assessment criteria</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Performance Guarantees</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>We strive to complete services within the scheduled timeframe</li>
                  <li>If we fail to meet service standards, we will re-clean at no extra cost</li>
                  <li>We are not responsible for delays due to circumstances beyond our control</li>
                  <li>Service quality may vary based on tank condition and accessibility</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Limitations</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>We cannot guarantee specific water quality outcomes</li>
                  <li>Service effectiveness depends on proper tank maintenance</li>
                  <li>We are not responsible for pre-existing tank damage or issues</li>
                  <li>External factors may affect cleaning results and tank condition</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg mb-8">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4">6. Intellectual Property Rights</h2>
                <p className="text-gray-600 mb-4">
                  All intellectual property rights in our services belong to QR Tanki:
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Our Rights</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li><strong>Platform Rights:</strong> All rights to our website, mobile app, and technology</li>
                  <li><strong>Content Rights:</strong> All text, images, graphics, and other content</li>
                  <li><strong>Brand Rights:</strong> QR Tanki name, logos, trademarks, and brand elements</li>
                  <li><strong>Software Rights:</strong> All software code, algorithms, and technical innovations</li>
                  <li><strong>Database Rights:</strong> All data compilations and proprietary information</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">User License</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>We grant you a limited, non-exclusive, non-transferable license to use our services</li>
                  <li>You may not copy, modify, distribute, or create derivative works of our content</li>
                  <li>You may not use our intellectual property without prior written consent</li>
                  <li>You may not remove or alter any copyright, trademark, or proprietary notices</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">User Content</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>You retain rights to content you create and upload to our platform</li>
                  <li>You grant us a license to use your content for service provision</li>
                  <li>You represent that you have the right to share such content</li>
                  <li>We are not responsible for the accuracy or legality of user-generated content</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg mb-8">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4">7. Privacy and Data Protection</h2>
                <p className="text-gray-600 mb-4">
                  We respect your privacy and protect your personal information as described in our Privacy Policy:
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Data Collection</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>We collect only necessary information for service provision</li>
                  <li>We collect personal information, tank details, and usage data</li>
                  <li>We may collect location data for service delivery</li>
                  <li>We use cookies and similar technologies for platform functionality</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Data Use</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>We use your data to provide, maintain, and improve our services</li>
                  <li>We may use your data for communication and customer support</li>
                  <li>We may use anonymized data for analytics and service improvement</li>
                  <li>We do not sell your personal information to third parties</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Data Protection</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>We implement appropriate security measures to protect your data</li>
                  <li>We limit access to your personal information to authorized personnel</li>
                  <li>We retain your data only as long as necessary for service provision</li>
                  <li>We comply with applicable data protection laws and regulations</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg mb-8">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4">8. Prohibited Activities</h2>
                <p className="text-gray-600 mb-4">
                  You may not use our services for any unlawful or prohibited purposes:
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Illegal Activities</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Violation of any applicable laws or regulations</li>
                  <li>Infringement of intellectual property rights</li>
                  <li>Defamation, harassment, or abusive behavior</li>
                  <li>Fraud, scams, or deceptive practices</li>
                  <li>Transmission of malicious code or viruses</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Platform Abuse</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Attempting to gain unauthorized access to our systems</li>
                  <li>Interfering with or disrupting our services</li>
                  <li>Using automated tools to access our platform excessively</li>
                  <li>Creating false or misleading accounts or information</li>
                  <li>Impersonating another person or entity</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Commercial Use</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Reselling our services without authorization</li>
                  <li>Using our platform for commercial competition</li>
                  <li>Extracting data for commercial purposes</li>
                  <li>Creating derivative services based on our platform</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg mb-8">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4">9. Disclaimers and Limitations of Liability</h2>
                <p className="text-gray-600 mb-4">
                  Our services are provided "as is" with certain disclaimers and limitations:
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Service Disclaimers</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>We do not guarantee that our services will be uninterrupted or error-free</li>
                  <li>We do not guarantee specific water quality or health outcomes</li>
                  <li>We are not responsible for the accuracy of user-generated content</li>
                  <li>We do not endorse any particular cleaning methods or products</li>
                  <li>Third-party services and content are not under our control</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Limitation of Liability</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Our liability is limited to the fees you paid for the affected services</li>
                  <li>We are not liable for indirect, incidental, or consequential damages</li>
                  <li>We are not liable for lost profits or business opportunities</li>
                  <li>We are not liable for data loss or system downtime</li>
                  <li>Some jurisdictions do not allow the exclusion of certain damages</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Indemnification</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>You agree to indemnify us for any claims arising from your use of services</li>
                  <li>You agree to indemnify us for any violation of these terms by you</li>
                  <li>You agree to cover our reasonable legal fees and costs</li>
                  <li>We reserve the right to assume exclusive defense of any claim</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg mb-8">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4">10. Dispute Resolution</h2>
                <p className="text-gray-600 mb-4">
                  We prefer to resolve disputes amicably through the following process:
                </p>
                
                <h3 className="text-xl font-semibold mb-3">Good Faith Negotiation</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Contact our customer support team to resolve the issue</li>
                  <li>Both parties will negotiate in good faith to find a resolution</li>
                  <li>We will respond to your concerns within a reasonable timeframe</li>
                  <li>Most disputes can be resolved through direct communication</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Governing Law</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>These terms are governed by the laws of India</li>
                  <li>Any disputes will be resolved in accordance with Indian law</li>
                  <li>Courts in Bangalore, India will have exclusive jurisdiction</li>
                  <li>International law provisions may apply for cross-border transactions</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3">Arbitration</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Unresolved disputes may be submitted to binding arbitration</li>
                  <li>Arbitration will be conducted by a neutral arbitrator</li>
                  <li>Arbitration decisions will be final and binding</li>
                  <li>Both parties will share arbitration costs equally</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg mb-8">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4">11. General Provisions</h2>
                
                <h3 className="text-xl font-semibold mb-3">Entire Agreement</h3>
                <p className="text-gray-600 mb-4">
                  These terms, along with our Privacy Policy and any other policies referenced herein, 
                  constitute the entire agreement between you and QR Tanki regarding your use of our services.
                </p>

                <h3 className="text-xl font-semibold mb-3">Severability</h3>
                <p className="text-gray-600 mb-4">
                  If any provision of these terms is found to be unenforceable, the remaining provisions 
                  will remain in full force and effect.
                </p>

                <h3 className="text-xl font-semibold mb-3">Waiver</h3>
                <p className="text-gray-600 mb-4">
                  Our failure to enforce any provision of these terms does not constitute a waiver 
                  of our right to enforce such provision in the future.
                </p>

                <h3 className="text-xl font-semibold mb-3">Assignment</h3>
                <p className="text-gray-600 mb-4">
                  You may not assign or transfer your rights or obligations under these terms 
                  without our prior written consent. We may assign our rights and obligations freely.
                </p>

                <h3 className="text-xl font-semibold mb-3">Force Majeure</h3>
                <p className="text-gray-600 mb-4">
                  We are not liable for failures or delays resulting from events beyond our 
                  reasonable control, including natural disasters, wars, or government actions.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4">12. Contact Information</h2>
                <p className="text-gray-600 mb-4">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <h3 className="font-semibold mb-2">General Inquiries</h3>
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600">
                        <Mail className="w-4 h-4 mr-2" />
                        info@qrtanki.com
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Phone className="w-4 h-4 mr-2" />
                        +91 8080 123456
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Legal Department</h3>
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600">
                        <Mail className="w-4 h-4 mr-2" />
                        legal@qrtanki.com
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
                    <strong>Effective Date:</strong> These terms are effective as of {lastUpdated} 
                    and will remain in effect until replaced by a new version.
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
              <Link href="/privacy" className="hover:text-blue-400">Privacy Policy</Link>
              <Link href="/contact" className="hover:text-blue-400">Contact Us</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}