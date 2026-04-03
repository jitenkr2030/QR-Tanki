'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  Star, 
  Home, 
  Building, 
  Droplets, 
  Zap, 
  Users, 
  Phone,
  Calendar,
  Clock,
  TrendingUp,
  Award,
  Shield,
  Truck,
  QrCode
} from 'lucide-react';
import { 
  simpleHomePricing, 
  tankCapacityPricing, 
  commercialTankPricing,
  subscriptionPlans,
  addOnServices,
  emergencyPricing,
  bulkDiscounts,
  qrCodePricing
} from '@/lib/pricing';

export default function HybridPricingSection() {
  const [selectedCategory, setSelectedCategory] = useState<'simple' | 'capacity' | 'commercial'>('simple');

  return (
    <section id="pricing" className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-blue-100 text-blue-800">
            <Award className="w-3 h-3 mr-1" />
            Transparent Pricing
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that works best for your needs
          </p>
        </div>

        <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as 'simple' | 'capacity' | 'commercial')}>
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-12">
            <TabsTrigger value="simple" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Standard Home
            </TabsTrigger>
            <TabsTrigger value="capacity" className="flex items-center gap-2">
              <Droplets className="w-4 h-4" />
              By Capacity
            </TabsTrigger>
            <TabsTrigger value="commercial" className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              Commercial
            </TabsTrigger>
          </TabsList>

          {/* Simple Pricing - Your Existing Structure */}
          <TabsContent value="simple" className="space-y-12">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-4xl mx-auto mb-8">
              <div className="flex items-center gap-3 mb-3">
                <Home className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-semibold text-blue-900">Standard Home Tank Pricing</h3>
              </div>
              <p className="text-blue-700">
                Perfect for regular home water tanks up to 500 liters. Simple, transparent pricing with no hidden charges.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {simpleHomePricing.map((plan, index) => (
                <Card 
                  key={index} 
                  className={`relative hover:shadow-xl transition-all duration-300 ${
                    plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <Badge className="bg-blue-500 text-white px-3 py-1">
                        {plan.badge === 'Most Popular' && <Star className="w-3 h-3 mr-1" />}
                        {plan.badge}
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      {plan.name === 'QR Code Sticker' && <QrCode className="w-8 h-8 text-blue-600" />}
                      {plan.name === 'Basic Plan' && <Droplets className="w-8 h-8 text-blue-600" />}
                      {plan.name === 'Premium Plan' && <Shield className="w-8 h-8 text-blue-600" />}
                      {plan.name === 'One-Time Clean' && <Zap className="w-8 h-8 text-blue-600" />}
                    </div>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="text-3xl font-bold text-gray-900">
                      ₹{plan.price}
                      {plan.name.includes('Plan') && <span className="text-lg font-normal">/month</span>}
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                    {plan.name.includes('Plan') && (
                      <div className="mt-2">
                        <Badge className="bg-green-100 text-green-800">
                          Save ₹{plan.name === 'Basic Plan' ? '180' : '389'} per year
                        </Badge>
                      </div>
                    )}
                    {plan.badge && plan.badge.includes('Market price') && (
                      <div className="mt-2">
                        <Badge className="bg-red-100 text-red-800">
                          {plan.badge}
                        </Badge>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full mt-6" variant={plan.popular ? 'default' : 'outline'}>
                      Select {plan.name}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Capacity-Based Pricing */}
          <TabsContent value="capacity" className="space-y-12">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 max-w-4xl mx-auto mb-8">
              <div className="flex items-center gap-3 mb-3">
                <Droplets className="w-6 h-6 text-orange-600" />
                <h3 className="text-xl font-semibold text-orange-900">Tank Capacity Pricing</h3>
              </div>
              <p className="text-orange-700">
                For larger home tanks above 500 liters. Pricing based on your tank's capacity with more features for larger tanks.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {tankCapacityPricing.map((tank, index) => (
                <Card key={index} className={`relative hover:shadow-xl transition-all duration-300 ${
                  index === 1 ? 'ring-2 ring-orange-500 scale-105' : ''
                }`}>
                  {index === 1 && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <Badge className="bg-orange-500 text-white px-3 py-1">
                        <Star className="w-3 h-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Droplets className="w-8 h-8 text-orange-600" />
                    </div>
                    <CardTitle className="text-xl">{tank.capacity}</CardTitle>
                    <CardDescription className="text-gray-600">{tank.liters}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Pricing */}
                    <div className="text-center space-y-3">
                      <div>
                        <div className="text-3xl font-bold text-gray-900">₹{tank.basicClean}</div>
                        <div className="text-sm text-gray-500">Basic Clean</div>
                      </div>
                      <div>
                        <div className="text-2xl font-semibold text-orange-600">₹{tank.deepClean}</div>
                        <div className="text-sm text-gray-500">Deep Clean</div>
                      </div>
                      <div className="pt-3 border-t">
                        <div className="text-2xl font-bold text-green-600">₹{tank.annualSubscription}</div>
                        <div className="text-sm text-gray-500">Annual Subscription (4 cleanings)</div>
                        <Badge className="mt-2 bg-green-100 text-green-800">
                          Save ₹{tank.basicClean * 4 - tank.annualSubscription}
                        </Badge>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Features Included:</h4>
                      <ul className="space-y-2">
                        {tank.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button className="w-full" variant={index === 1 ? 'default' : 'outline'}>
                      Select {tank.capacity}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Commercial Pricing */}
          <TabsContent value="commercial" className="space-y-12">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 max-w-4xl mx-auto mb-8">
              <div className="flex items-center gap-3 mb-3">
                <Building className="w-6 h-6 text-purple-600" />
                <h3 className="text-xl font-semibold text-purple-900">Commercial & Underground Tanks</h3>
              </div>
              <p className="text-purple-700">
                For commercial buildings, societies, and underground water tanks with priority service and comprehensive reporting.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {commercialTankPricing.map((tank, index) => (
                <Card key={index} className={`relative hover:shadow-xl transition-all duration-300 ${
                  index === 1 ? 'ring-2 ring-purple-500 scale-105' : ''
                }`}>
                  {index === 1 && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <Badge className="bg-purple-500 text-white px-3 py-1">
                        <Building className="w-3 h-3 mr-1" />
                        Business Choice
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Building className="w-8 h-8 text-purple-600" />
                    </div>
                    <CardTitle className="text-xl">{tank.size}</CardTitle>
                    <CardDescription className="text-gray-600">{tank.capacity}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Pricing */}
                    <div className="text-center space-y-3">
                      <div>
                        <div className="text-3xl font-bold text-gray-900">₹{tank.basicClean}</div>
                        <div className="text-sm text-gray-500">Basic Clean</div>
                      </div>
                      <div>
                        <div className="text-2xl font-semibold text-purple-600">₹{tank.deepClean}</div>
                        <div className="text-sm text-gray-500">Deep Clean</div>
                      </div>
                      <div className="pt-3 border-t">
                        <div className="text-2xl font-bold text-green-600">₹{tank.quarterlySubscription}</div>
                        <div className="text-sm text-gray-500">Quarterly Subscription (4 cleanings)</div>
                        <Badge className="mt-2 bg-green-100 text-green-800">
                          Save ₹{tank.basicClean * 4 - tank.quarterlySubscription}
                        </Badge>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Features Included:</h4>
                      <ul className="space-y-2">
                        {tank.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button className="w-full" variant={index === 1 ? 'default' : 'outline'}>
                      Select {tank.size}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* QR Code Pricing */}
        <div className="mt-20">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="pt-8 pb-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">QR Code Tracking System</h3>
                  <p className="text-gray-600 mb-6">
                    Get your unique QR code sticker for digital tracking and service history
                  </p>
                  <div className="space-y-4">
                    <div>
                      <div className="text-xl font-semibold text-blue-600">₹{qrCodePricing.sticker.price}</div>
                      <div className="text-sm text-gray-600">Printable QR Sticker (One-time)</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-gray-700">₹{qrCodePricing.renewal.price}/year</div>
                      <div className="text-sm text-gray-600">Annual Digital Services Renewal</div>
                    </div>
                  </div>
                  <Button className="mt-6 bg-blue-600 hover:bg-blue-700">
                    Get QR Code
                  </Button>
                </div>
                <div className="space-y-3">
                  {qrCodePricing.sticker.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-blue-600 mr-3" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0">
            <CardContent className="pt-12 pb-12">
              <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
              <p className="text-xl mb-8 opacity-90">
                Join thousands of satisfied customers who trust QR Tanki for clean water
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Online
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}