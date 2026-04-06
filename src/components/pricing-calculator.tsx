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
  residentialTankPricing,
  commercialTankPricing,
  addOnServices,
  subscriptionPlans,
  emergencyPricing,
  calculateTankPrice,
  calculateTotalPrice,
  calculateBulkDiscount,
  applySeasonalPricing,
  pricingData
} from '@/lib/pricing';

interface PricingCalculatorProps {
  onPriceCalculated?: (price: number, details: any) => void;
}

export default function PricingCalculator({ onPriceCalculated }: PricingCalculatorProps) {
  const [tankType, setTankType] = useState<'residential' | 'commercial'>('residential');
  const [selectedTank, setSelectedTank] = useState(0);
  const [serviceType, setServiceType] = useState<'basic' | 'deep'>('basic');
  const [isSubscription, setIsSubscription] = useState(false);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [emergencyType, setEmergencyType] = useState<string>('');
  const [tankCount, setTankCount] = useState(1);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const currentPricing = tankType === 'residential' ? residentialTankPricing : commercialTankPricing;
  const selectedTankPricing = currentPricing[selectedTank];

  const getSeasonalAdjustment = () => {
    const currentMonth = new Date().getMonth() + 1;
    if ([6, 7, 8, 9].includes(currentMonth)) return { name: 'Monsoon', adjustment: 1.2 };
    if ([11, 12, 1, 2].includes(currentMonth)) return { name: 'Winter', adjustment: 0.85 };
    return { name: 'Normal', adjustment: 1.0 };
  };

  const calculatePrice = useCallback(() => {
    let basePrice = calculateTankPrice(tankType, selectedTank, serviceType, isSubscription);
    
    // Apply seasonal pricing
    basePrice = applySeasonalPricing(basePrice);
    
    // Calculate for multiple tanks
    let totalPrice = basePrice * tankCount;
    
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
        tankType,
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
  }, [tankType, selectedTank, serviceType, isSubscription, selectedAddOns, emergencyType, tankCount, onPriceCalculated]);

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
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-6 h-6 text-blue-600" />
            QR Tanki Pricing Calculator
          </CardTitle>
          <CardDescription>
            Get instant pricing for your tank cleaning needs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={tankType} onValueChange={(value) => setTankType(value as 'residential' | 'commercial')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="residential" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                Residential
              </TabsTrigger>
              <TabsTrigger value="commercial" className="flex items-center gap-2">
                <Building className="w-4 h-4" />
                Commercial
              </TabsTrigger>
            </TabsList>

            <TabsContent value="residential" className="space-y-6 mt-6">
              <div className="grid md:grid-cols-3 gap-4">
                {residentialTankPricing.map((tank, index) => (
                  <Card 
                    key={index}
                    className={`cursor-pointer transition-all ${
                      selectedTank === index ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
                    }`}
                    onClick={() => setSelectedTank(index)}
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{tank.size}</CardTitle>
                      <CardDescription>{tank.capacity}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Basic Clean:</span>
                          <span className="font-semibold">₹{tank.basicClean}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Deep Clean:</span>
                          <span className="font-semibold">₹{tank.deepClean}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Annual:</span>
                          <span className="font-semibold text-green-600">₹{tank.annualSubscription}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="commercial" className="space-y-6 mt-6">
              <div className="grid md:grid-cols-3 gap-4">
                {commercialTankPricing.map((tank, index) => (
                  <Card 
                    key={index}
                    className={`cursor-pointer transition-all ${
                      selectedTank === index ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
                    }`}
                    onClick={() => setSelectedTank(index)}
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{tank.size}</CardTitle>
                      <CardDescription>{tank.capacity}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Basic Clean:</span>
                          <span className="font-semibold">₹{tank.basicClean}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Deep Clean:</span>
                          <span className="font-semibold">₹{tank.deepClean}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Quarterly:</span>
                          <span className="font-semibold text-green-600">₹{tank.quarterlySubscription}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Service Type Selection */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label className="text-base font-semibold">Service Type</Label>
              <div className="flex gap-3">
                <Button
                  variant={serviceType === 'basic' ? 'default' : 'outline'}
                  onClick={() => setServiceType('basic')}
                  className="flex-1"
                >
                  <Droplets className="w-4 h-4 mr-2" />
                  Basic Clean
                </Button>
                <Button
                  variant={serviceType === 'deep' ? 'default' : 'outline'}
                  onClick={() => setServiceType('deep')}
                  className="flex-1"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Deep Clean
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold">Service Plan</Label>
              <div className="flex gap-3">
                <Button
                  variant={!isSubscription ? 'default' : 'outline'}
                  onClick={() => setIsSubscription(false)}
                  className="flex-1"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  One-Time
                </Button>
                <Button
                  variant={isSubscription ? 'default' : 'outline'}
                  onClick={() => setIsSubscription(true)}
                  className="flex-1"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Subscription
                </Button>
              </div>
            </div>
          </div>

          {/* Tank Count for Bulk Pricing */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Number of Tanks</Label>
            <div className="flex items-center gap-4">
              <Select value={tankCount.toString()} onValueChange={(value) => setTankCount(parseInt(value))}>
                <SelectTrigger className="w-32">
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
                <Badge className="bg-green-100 text-green-800">
                  <Users className="w-3 h-3 mr-1" />
                  {bulkDiscount}% Bulk Discount
                </Badge>
              )}
            </div>
          </div>

          {/* Emergency Services */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Emergency Services (Optional)</Label>
            <div className="grid md:grid-cols-2 gap-3">
              {Object.entries(emergencyPricing).map(([key, service]) => (
                <div key={key} className="flex items-center space-x-2">
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
                  />
                  <Label htmlFor={key} className="text-sm cursor-pointer">
                    {service.name} - ₹{service.surcharge}
                    <span className="text-gray-500 ml-2">({service.description})</span>
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Add-on Services */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Add-on Services</Label>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {addOnServices.map((addOn) => (
                <Card key={addOn.id} className="p-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id={addOn.id}
                      checked={selectedAddOns.includes(addOn.id)}
                      onCheckedChange={(checked) => handleAddOnToggle(addOn.id, checked as boolean)}
                    />
                    <div className="flex-1">
                      <Label htmlFor={addOn.id} className="cursor-pointer">
                        <div className="font-medium text-sm">{addOn.name}</div>
                        <div className="text-gray-500 text-xs">{addOn.description}</div>
                        <div className="text-blue-600 font-semibold text-sm mt-1">₹{addOn.price}</div>
                      </Label>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Price Display */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600">Total Price</div>
                  <div className="text-3xl font-bold text-blue-600">₹{calculatedPrice.toLocaleString()}</div>
                  {seasonal.adjustment !== 1.0 && (
                    <Badge className="mt-2 bg-orange-100 text-orange-800">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {seasonal.name} Pricing ({seasonal.adjustment > 1 ? '+' : ''}{Math.round((seasonal.adjustment - 1) * 100)}%)
                    </Badge>
                  )}
                </div>
                <Button 
                  size="lg" 
                  onClick={() => setShowBreakdown(!showBreakdown)}
                  className="bg-blue-600 hover:bg-blue-700"
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
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Base Price ({selectedTankPricing.size} - {serviceType}):</span>
                  <span>₹{calculateTankPrice(tankType, selectedTank, serviceType, isSubscription)}</span>
                </div>
                {tankCount > 1 && (
                  <div className="flex justify-between">
                    <span>× {tankCount} tanks:</span>
                    <span>₹{calculateTankPrice(tankType, selectedTank, serviceType, isSubscription) * tankCount}</span>
                  </div>
                )}
                {selectedAddOns.map(addOnId => {
                  const addOn = addOnServices.find(s => s.id === addOnId);
                  return addOn ? (
                    <div key={addOnId} className="flex justify-between">
                      <span>{addOn.name} × {tankCount}:</span>
                      <span>₹{addOn.price * tankCount}</span>
                    </div>
                  ) : null;
                })}
                {emergencyType && (
                  <div className="flex justify-between">
                    <span>{emergencyPricing[emergencyType as keyof typeof emergencyPricing].name}:</span>
                    <span>₹{emergencyPricing[emergencyType as keyof typeof emergencyPricing].surcharge}</span>
                  </div>
                )}
                {bulkDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Bulk Discount ({bulkDiscount}%):</span>
                    <span>-₹{Math.round((calculatedPrice / (1 - bulkDiscount / 100)) * bulkDiscount / 100)}</span>
                  </div>
                )}
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
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