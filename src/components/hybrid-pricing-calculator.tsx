'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calculator, 
  Droplets, 
  Clock, 
  Zap, 
  CheckCircle, 
  Star,
  TrendingUp,
  Users,
  Home,
  Building,
  AlertCircle,
  Calendar,
  Phone
} from 'lucide-react';
import {
  simpleHomePricing,
  tankCapacityPricing,
  commercialTankPricing,
  addOnServices,
  subscriptionPlans,
  emergencyPricing,
  calculateTankPrice,
  calculateTotalPrice,
  calculateBulkDiscount,
  applySeasonalPricing,
  getTankPricingInfo,
  pricingData
} from '@/lib/pricing';

interface PricingCalculatorProps {
  onPriceCalculated?: (price: number, details: any) => void;
}

export default function HybridPricingCalculator({ onPriceCalculated }: PricingCalculatorProps) {
  const [pricingType, setPricingType] = useState<'simple' | 'capacity' | 'commercial'>('simple');
  const [selectedTank, setSelectedTank] = useState(0);
  const [serviceType, setServiceType] = useState<'basic' | 'deep'>('basic');
  const [isSubscription, setIsSubscription] = useState(false);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [emergencyType, setEmergencyType] = useState<string>('');
  const [tankCount, setTankCount] = useState(1);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const currentPricing = pricingType === 'simple' 
    ? simpleHomePricing 
    : pricingType === 'capacity' 
    ? tankCapacityPricing 
    : commercialTankPricing;

  const selectedTankPricing = getTankPricingInfo(pricingType, selectedTank);

  const getSeasonalAdjustment = () => {
    const currentMonth = new Date().getMonth() + 1;
    if ([6, 7, 8, 9].includes(currentMonth)) return { name: 'Monsoon', adjustment: 1.2 };
    if ([11, 12, 1, 2].includes(currentMonth)) return { name: 'Winter', adjustment: 0.85 };
    return { name: 'Normal', adjustment: 1.0 };
  };

  const calculatePrice = useCallback(() => {
    let basePrice = 0;

    if (pricingType === 'simple') {
      // Use simple pricing structure
      if (isSubscription) {
        basePrice = serviceType === 'basic' ? 999 : 1999; // Yearly subscription
      } else {
        if (serviceType === 'basic') {
          basePrice = 99; // Monthly basic
        } else {
          basePrice = 199; // Monthly premium
        }
      }
    } else {
      // Use capacity-based pricing
      basePrice = calculateTankPrice(pricingType, selectedTank, serviceType, isSubscription);
    }
    
    // Apply seasonal pricing
    const seasonalPrice = applySeasonalPricing(basePrice);
    
    // Calculate for multiple tanks
    let totalPrice = seasonalPrice * tankCount;
    
    // Add add-ons (per tank)
    selectedAddOns.forEach(addOnId => {
      const addOn = addOnServices.find(service => service.id === addOnId);
      if (addOn) {
        totalPrice += addOn.price * tankCount;
      }
    });
    
    // Add emergency surcharge (one time)
    if (emergencyType && emergencyPricing[emergencyType as keyof typeof emergencyPricing]) {
      totalPrice += emergencyPricing[emergencyType as keyof typeof emergencyPricing].surcharge;
    }
    
    // Apply bulk discount
    const discountPercentage = calculateBulkDiscount(tankCount);
    if (discountPercentage > 0) {
      totalPrice = totalPrice * (1 - discountPercentage / 100);
    }
    
    const finalPrice = Math.round(totalPrice);
    
    if (onPriceCalculated) {
      onPriceCalculated(finalPrice, {
        pricingType,
        selectedTank,
        serviceType,
        isSubscription,
        selectedAddOns,
        emergencyType,
        tankCount,
        basePrice,
        discount: discountPercentage,
        seasonalAdjustment: getSeasonalAdjustment()
      });
    }
    
    return finalPrice;
  }, [pricingType, selectedTank, serviceType, isSubscription, selectedAddOns, emergencyType, tankCount, onPriceCalculated]);

  // Calculate price whenever dependencies change
  const calculatedPrice = calculatePrice();

  const handleAddOnToggle = (addOnId: string, checked: boolean) => {
    if (checked) {
      setSelectedAddOns([...selectedAddOns, addOnId]);
    } else {
      setSelectedAddOns(selectedAddOns.filter(id => id !== addOnId));
    }
  };

  const bulkDiscount = calculateBulkDiscount(tankCount);
  const seasonal = getSeasonalAdjustment();

  return (
    <div className="w-full max-w-4xl mx-auto p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
      <Card>
        <CardHeader className="pb-4 sm:pb-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Calculator className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            QR Tanki Pricing Calculator
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Get instant pricing for your tank cleaning needs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <Tabs value={pricingType} onValueChange={(value) => setPricingType(value as 'simple' | 'capacity' | 'commercial')}>
            <TabsList className="grid w-full grid-cols-3 h-auto p-1">
              <TabsTrigger value="simple" className="flex flex-col items-center gap-1 p-2 text-xs sm:text-sm">
                <Home className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Standard Home</span>
                <span className="sm:hidden">Home</span>
              </TabsTrigger>
              <TabsTrigger value="capacity" className="flex flex-col items-center gap-1 p-2 text-xs sm:text-sm">
                <Droplets className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">By Capacity</span>
                <span className="sm:hidden">Capacity</span>
              </TabsTrigger>
              <TabsTrigger value="commercial" className="flex flex-col items-center gap-1 p-2 text-xs sm:text-sm">
                <Building className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Commercial</span>
                <span className="sm:hidden">Business</span>
              </TabsTrigger>
            </TabsList>

            {/* Simple Pricing Tab */}
            <TabsContent value="simple" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                <h3 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">Standard Home Tank Pricing</h3>
                <p className="text-blue-700 text-xs sm:text-sm">
                  Perfect for regular home water tanks up to 500 liters. Simple, transparent pricing with no hidden charges.
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                <Card className={`cursor-pointer transition-all ${
                  serviceType === 'basic' ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
                }`} onClick={() => setServiceType('basic')}>
                  <CardHeader className="pb-2 sm:pb-3">
                    <CardTitle className="text-base sm:text-lg">Basic Plan</CardTitle>
                    <CardDescription className="text-sm">₹99/month (billed yearly at ₹999)</CardDescription>
                    <Badge className="bg-green-100 text-green-800 text-xs">Save ₹180 per year</Badge>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1 sm:space-y-2">
                      <li className="flex items-center text-xs sm:text-sm">
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 flex-shrink-0" />
                        2 cleaning every year
                      </li>
                      <li className="flex items-center text-xs sm:text-sm">
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 flex-shrink-0" />
                        Basic cleaning type
                      </li>
                      <li className="flex items-center text-xs sm:text-sm">
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 flex-shrink-0" />
                        Photo proof
                      </li>
                      <li className="flex items-center text-xs sm:text-sm">
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 flex-shrink-0" />
                        Email reminders
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className={`cursor-pointer transition-all ${
                  serviceType === 'deep' ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
                }`} onClick={() => setServiceType('deep')}>
                  <CardHeader className="pb-2 sm:pb-3">
                    <CardTitle className="text-base sm:text-lg">Premium Plan</CardTitle>
                    <CardDescription className="text-sm">₹199/month (billed yearly at ₹1,999)</CardDescription>
                    <Badge className="bg-green-100 text-green-800 text-xs">Save ₹389 per year</Badge>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1 sm:space-y-2">
                      <li className="flex items-center text-xs sm:text-sm">
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 flex-shrink-0" />
                        2 cleaning per year
                      </li>
                      <li className="flex items-center text-xs sm:text-sm">
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 flex-shrink-0" />
                        Deep cleaning included
                      </li>
                      <li className="flex items-center text-xs sm:text-sm">
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 flex-shrink-0" />
                        Water quality testing
                      </li>
                      <li className="flex items-center text-xs sm:text-sm">
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 flex-shrink-0" />
                        Priority support
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Capacity-Based Pricing Tab */}
            <TabsContent value="capacity" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 sm:p-4">
                <h3 className="font-semibold text-orange-900 mb-2 text-sm sm:text-base">Tank Capacity Pricing</h3>
                <p className="text-orange-700 text-xs sm:text-sm">
                  For larger home tanks above 500 liters. Pricing based on your tank's capacity.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {tankCapacityPricing.map((tank, index) => (
                  <Card 
                    key={index}
                    className={`cursor-pointer transition-all ${
                      selectedTank === index ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
                    }`}
                    onClick={() => setSelectedTank(index)}
                  >
                    <CardHeader className="pb-2 sm:pb-3">
                      <CardTitle className="text-sm sm:text-base">{tank.capacity}</CardTitle>
                      <CardDescription className="text-xs">{tank.liters}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1 sm:space-y-2">
                        <div className="flex justify-between">
                          <span className="text-xs">Basic:</span>
                          <span className="font-semibold text-xs">₹{tank.basicClean}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs">Deep:</span>
                          <span className="font-semibold text-xs">₹{tank.deepClean}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs">Annual:</span>
                          <span className="font-semibold text-green-600 text-xs">₹{tank.annualSubscription}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Commercial Pricing Tab */}
            <TabsContent value="commercial" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 sm:p-4">
                <h3 className="font-semibold text-purple-900 mb-2 text-sm sm:text-base">Commercial & Underground Tanks</h3>
                <p className="text-purple-700 text-xs sm:text-sm">
                  For commercial buildings, societies, and underground water tanks.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {commercialTankPricing.map((tank, index) => (
                  <Card 
                    key={index}
                    className={`cursor-pointer transition-all ${
                      selectedTank === index ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
                    }`}
                    onClick={() => setSelectedTank(index)}
                  >
                    <CardHeader className="pb-2 sm:pb-3">
                      <CardTitle className="text-sm sm:text-base">{tank.size}</CardTitle>
                      <CardDescription className="text-xs">{tank.capacity}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1 sm:space-y-2">
                        <div className="flex justify-between">
                          <span className="text-xs">Basic:</span>
                          <span className="font-semibold text-xs">₹{tank.basicClean}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs">Deep:</span>
                          <span className="font-semibold text-xs">₹{tank.deepClean}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs">Quarterly:</span>
                          <span className="font-semibold text-green-600 text-xs">₹{tank.quarterlySubscription}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Service Type Selection (for non-simple pricing) */}
          {pricingType !== 'simple' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2 sm:space-y-3">
                <Label className="text-sm sm:text-base font-semibold">Service Type</Label>
                <div className="flex gap-2 sm:gap-3">
                  <Button
                    variant={serviceType === 'basic' ? 'default' : 'outline'}
                    onClick={() => setServiceType('basic')}
                    className="flex-1 text-xs sm:text-sm h-10 sm:h-auto"
                  >
                    <Droplets className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    Basic Clean
                  </Button>
                  <Button
                    variant={serviceType === 'deep' ? 'default' : 'outline'}
                    onClick={() => setServiceType('deep')}
                    className="flex-1 text-xs sm:text-sm h-10 sm:h-auto"
                  >
                    <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    Deep Clean
                  </Button>
                </div>
              </div>

              <div className="space-y-2 sm:space-y-3">
                <Label className="text-sm sm:text-base font-semibold">Service Plan</Label>
                <div className="flex gap-2 sm:gap-3">
                  <Button
                    variant={!isSubscription ? 'default' : 'outline'}
                    onClick={() => setIsSubscription(false)}
                    className="flex-1 text-xs sm:text-sm h-10 sm:h-auto"
                  >
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    One-Time
                  </Button>
                  <Button
                    variant={isSubscription ? 'default' : 'outline'}
                    onClick={() => setIsSubscription(true)}
                    className="flex-1 text-xs sm:text-sm h-10 sm:h-auto"
                  >
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    Subscription
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Tank Count for Bulk Pricing */}
          <div className="space-y-2 sm:space-y-3">
            <Label className="text-sm sm:text-base font-semibold">Number of Tanks</Label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <Select value={tankCount.toString()} onValueChange={(value) => setTankCount(parseInt(value))}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30].map(num => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? 'Tank' : 'Tanks'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {bulkDiscount > 0 && (
                <Badge className="bg-green-100 text-green-800 text-xs">
                  <Users className="w-3 h-3 mr-1" />
                  {bulkDiscount}% Bulk Discount
                </Badge>
              )}
            </div>
          </div>

          {/* Emergency Services */}
          <div className="space-y-2 sm:space-y-3">
            <Label className="text-sm sm:text-base font-semibold">Emergency Services (Optional)</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {Object.entries(emergencyPricing).map(([key, service]) => (
                <div key={key} className="flex items-start sm:items-center space-x-2">
                  <Checkbox
                    id={key}
                    checked={emergencyType === key}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setEmergencyType(key);
                      } else {
                        setEmergencyType('');
                      }
                    }}
                    className="mt-0.5 sm:mt-0"
                  />
                  <Label htmlFor={key} className="text-xs sm:text-sm cursor-pointer leading-tight">
                    {service.name} - ₹{service.surcharge}
                    <span className="text-gray-500 block sm:inline sm:ml-2">({service.description})</span>
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Add-on Services */}
          <div className="space-y-2 sm:space-y-3">
            <Label className="text-sm sm:text-base font-semibold">Add-on Services</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {addOnServices.map((addOn) => (
                <Card key={addOn.id} className="p-3 sm:p-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id={addOn.id}
                      checked={selectedAddOns.includes(addOn.id)}
                      onCheckedChange={(checked) => handleAddOnToggle(addOn.id, checked as boolean)}
                      className="mt-0.5 sm:mt-0"
                    />
                    <div className="flex-1 min-w-0">
                      <Label htmlFor={addOn.id} className="cursor-pointer">
                        <div className="font-medium text-xs sm:text-sm truncate">{addOn.name}</div>
                        <div className="text-gray-500 text-xs mt-1 line-clamp-2">{addOn.description}</div>
                        <div className="text-blue-600 font-semibold text-xs sm:text-sm mt-1">₹{addOn.price}</div>
                      </Label>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Price Display */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="pt-4 sm:pt-6 pb-4 sm:pb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="text-sm text-gray-600">Total Price</div>
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600">₹{calculatedPrice.toLocaleString()}</div>
                  {seasonal.adjustment !== 1.0 && (
                    <Badge className="mt-2 bg-orange-100 text-orange-800 text-xs">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {seasonal.name} Pricing ({seasonal.adjustment > 1 ? '+' : ''}{Math.round((seasonal.adjustment - 1) * 100)}%)
                    </Badge>
                  )}
                </div>
                <Button 
                  size="lg" 
                  onClick={() => setShowBreakdown(!showBreakdown)}
                  className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                >
                  {showBreakdown ? 'Hide' : 'Show'} Breakdown
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Price Breakdown */}
          {showBreakdown && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Price Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3">
                {pricingType === 'simple' ? (
                  <div className="flex justify-between text-sm">
                    <span>Standard Home Tank ({serviceType === 'basic' ? 'Basic' : 'Premium'} Plan):</span>
                    <span>₹{serviceType === 'basic' ? (isSubscription ? 999 : 99) : (isSubscription ? 1999 : 199)}</span>
                  </div>
                ) : (
                  <div className="flex justify-between text-sm">
                    <span>{selectedTankPricing.capacity} - {serviceType}:</span>
                    <span>₹{calculateTankPrice(pricingType, selectedTank, serviceType, isSubscription)}</span>
                  </div>
                )}
                {tankCount > 1 && (
                  <div className="flex justify-between text-sm">
                    <span>× {tankCount} tanks:</span>
                    <span>₹{calculateTankPrice(pricingType, selectedTank, serviceType, isSubscription) * tankCount}</span>
                  </div>
                )}
                {selectedAddOns.map(addOnId => {
                  const addOn = addOnServices.find(s => s.id === addOnId);
                  return addOn ? (
                    <div key={addOnId} className="flex justify-between text-sm">
                      <span>{addOn.name} × {tankCount}:</span>
                      <span>₹{addOn.price * tankCount}</span>
                    </div>
                  ) : null;
                })}
                {emergencyType && (
                  <div className="flex justify-between text-sm">
                    <span>{emergencyPricing[emergencyType as keyof typeof emergencyPricing].name}:</span>
                    <span>₹{emergencyPricing[emergencyType as keyof typeof emergencyPricing].surcharge}</span>
                  </div>
                )}
                {bulkDiscount > 0 && (
                  <div className="flex justify-between text-green-600 text-sm">
                    <span>Bulk Discount ({bulkDiscount}%):</span>
                    <span>-₹{Math.round((calculatedPrice / (1 - bulkDiscount / 100)) * bulkDiscount / 100)}</span>
                  </div>
                )}
                <div className="border-t pt-2 sm:pt-3 flex justify-between font-bold text-base sm:text-lg">
                  <span>Total:</span>
                  <span>₹{calculatedPrice}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}