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
  Truck
} from 'lucide-react';
import { 
  residentialTankPricing, 
  commercialTankPricing, 
  subscriptionPlans,
  addOnServices,
  emergencyPricing,
  bulkDiscounts,
  qrCodePricing
} from '@/lib/pricing';

export default function ComprehensivePricingSection() {
  const [selectedCategory, setSelectedCategory] = useState<'residential' | 'commercial'>('residential');

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
            Choose Your Perfect Cleaning Plan
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tank-size based pricing with no hidden charges. Quality service guaranteed.
          </p>
        </div>

        <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as 'residential' | 'commercial')}>
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
            <TabsTrigger value="residential" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Residential Tanks
            </TabsTrigger>
            <TabsTrigger value="commercial" className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              Commercial Tanks
            </TabsTrigger>
          </TabsList>

          {/* Residential Pricing */}
          <TabsContent value="residential" className="space-y-12">
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {residentialTankPricing.map((tank, index) => (
                <Card key={index} className={`relative hover:shadow-xl transition-all duration-300 ${
                  index === 1 ? 'ring-2 ring-blue-500 scale-105' : ''
                }`}>
                  {index === 1 && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <Badge className="bg-blue-500 text-white px-3 py-1">
                        <Star className="w-3 h-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Droplets className="w-8 h-8 text-blue-600" />
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
                        <div className="text-2xl font-semibold text-blue-600">₹{tank.deepClean}</div>
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
                      Select {tank.size}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Commercial Pricing */}
          <TabsContent value="commercial" className="space-y-12">
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {commercialTankPricing.map((tank, index) => (
                <Card key={index} className={`relative hover:shadow-xl transition-all duration-300 ${
                  index === 1 ? 'ring-2 ring-orange-500 scale-105' : ''
                }`}>
                  {index === 1 && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <Badge className="bg-orange-500 text-white px-3 py-1">
                        <Building className="w-3 h-3 mr-1" />
                        Business Choice
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Building className="w-8 h-8 text-orange-600" />
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
                        <div className="text-2xl font-semibold text-orange-600">₹{tank.deepClean}</div>
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

        {/* Add-on Services */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Enhance Your Service</h3>
            <p className="text-gray-600">Add these services to your cleaning package</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {addOnServices.slice(0, 8).map((service) => (
              <Card key={service.id} className="hover:shadow-lg transition-all">
                <CardHeader className="text-center pb-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    {service.category === 'testing' && <Droplets className="w-6 h-6 text-purple-600" />}
                    {service.category === 'service' && <Truck className="w-6 h-6 text-purple-600" />}
                    {service.category === 'digital' && <Shield className="w-6 h-6 text-purple-600" />}
                  </div>
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-2">₹{service.price}</div>
                  <p className="text-sm text-gray-600 mb-4">{service.description}</p>
                  <Button variant="outline" size="sm" className="w-full">
                    Add Service
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Emergency Services */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-red-100 text-red-800">
              <Clock className="w-3 h-3 mr-1" />
              Emergency Services
            </Badge>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Need Urgent Service?</h3>
            <p className="text-gray-600">We're available when you need us most</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {Object.entries(emergencyPricing).map(([key, service]) => (
              <Card key={key} className="border-red-200 hover:shadow-lg transition-all">
                <CardHeader className="text-center pb-3">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Phone className="w-6 h-6 text-red-600" />
                  </div>
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-2xl font-bold text-red-600 mb-2">+₹{service.surcharge}</div>
                  <p className="text-sm text-gray-600 mb-4">{service.description}</p>
                  <Button variant="outline" size="sm" className="w-full border-red-200 text-red-600 hover:bg-red-50">
                    Book Emergency
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Bulk Discounts */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-green-100 text-green-800">
              <Users className="w-3 h-3 mr-1" />
              Bulk Discounts
            </Badge>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Multiple Tanks? Save More!</h3>
            <p className="text-gray-600">Special pricing for societies, apartments, and businesses</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {bulkDiscounts.map((discount, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="text-3xl font-bold text-green-600">{discount.discount}% OFF</div>
                  <CardTitle className="text-lg">
                    {discount.minTanks === 5 ? 'Small Society' : 
                     discount.minTanks === 11 ? 'Medium Society' : 'Large Society'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    {discount.minTanks === 5 ? '5-10 tanks' : 
                     discount.minTanks === 11 ? '11-20 tanks' : '21+ tanks'}
                  </p>
                  {discount.minTanks >= 21 && (
                    <Badge className="bg-gold-100 text-yellow-800">
                      <Award className="w-3 h-3 mr-1" />
                      Dedicated Manager
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

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