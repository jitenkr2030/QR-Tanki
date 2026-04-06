// Comprehensive pricing system for QR Tanki
// Maintains simple pricing for up to 500L tanks, adds capacity-based pricing for larger tanks

export interface SimplePricing {
  name: string;
  price: number;
  description: string;
  features: string[];
  popular?: boolean;
  badge?: string;
}

export interface TankCapacityPricing {
  capacity: string;
  liters: string;
  basicClean: number;
  deepClean: number;
  annualSubscription: number;
  features: string[];
}

export interface CommercialPricing {
  size: string;
  capacity: string;
  basicClean: number;
  deepClean: number;
  quarterlySubscription: number;
  features: string[];
}

export interface AddOnService {
  id: string;
  name: string;
  price: number;
  description: string;
  category: 'testing' | 'service' | 'digital';
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  duration: 'monthly' | 'quarterly' | 'annual';
  price: number;
  cleanings: number;
  features: string[];
  popular?: boolean;
}

// Simple Pricing for Home Tanks up to 500L (Your existing structure)
export const simpleHomePricing: SimplePricing[] = [
  {
    name: 'QR Code Sticker',
    price: 499,
    description: 'Printable QR sticker for your tank',
    features: [
      'Printable QR sticker',
      'Online tracking',
      'Annual renewal ₹199/year'
    ]
  },
  {
    name: 'Basic Plan',
    price: 99,
    description: 'Billed yearly at ₹999 (2 cleaning/year)',
    features: [
      '2 cleaning every year',
      'Basic cleaning type',
      'Photo proof',
      'Email reminders'
    ],
    popular: true,
    badge: 'Most Popular'
  },
  {
    name: 'Premium Plan',
    price: 199,
    description: 'Billed yearly at ₹1,999 (2 cleaning/year)',
    features: [
      '2 cleaning per year',
      'Deep cleaning included',
      'Water quality testing',
      'Priority support',
      'Digital certificate',
      'SMS reminders'
    ]
  },
  {
    name: 'One-Time Clean',
    price: 699,
    description: 'Single cleaning service',
    features: [
      'One-time service',
      'Professional cleaning',
      'Photo documentation',
      'Quality assurance'
    ],
    badge: 'Market price ₹999 → Now ₹699'
  }
];

// Tank Capacity Pricing for Home Tanks above 500L
export const tankCapacityPricing: TankCapacityPricing[] = [
  {
    capacity: 'Small Tank',
    liters: '100-500 Liters',
    basicClean: 299,
    deepClean: 499,
    annualSubscription: 1499,
    features: ['Photo proof', 'Digital access', 'Email reminders']
  },
  {
    capacity: 'Medium Tank',
    liters: '500-1000 Liters',
    basicClean: 399,
    deepClean: 599,
    annualSubscription: 1999,
    features: ['Photo proof', 'Water quality test', 'Digital access', 'SMS reminders']
  },
  {
    capacity: 'Large Tank',
    liters: '1000-2000 Liters',
    basicClean: 499,
    deepClean: 699,
    annualSubscription: 2499,
    features: ['Priority support', 'Digital certificate', 'SMS/email reminders']
  },
  {
    capacity: 'Extra Large Tank',
    liters: '2000-5000 Liters',
    basicClean: 799,
    deepClean: 999,
    annualSubscription: 3999,
    features: ['Priority support', 'Advanced testing', 'Digital certificate', 'Dedicated manager']
  }
];

// Commercial/Underground Tank Pricing
export const commercialTankPricing: CommercialPricing[] = [
  {
    size: 'Sump Tank',
    capacity: '1000-3000 Liters',
    basicClean: 799,
    deepClean: 999,
    quarterlySubscription: 3999,
    features: ['Priority support', 'Detailed report', 'SMS reminders']
  },
  {
    size: 'Underground Tank',
    capacity: '3000-5000 Liters',
    basicClean: 999,
    deepClean: 1499,
    quarterlySubscription: 5999,
    features: ['Water testing', 'Priority support', 'Digital certificate']
  },
  {
    size: 'Large Underground',
    capacity: '5000+ Liters',
    basicClean: 1499,
    deepClean: 1999,
    quarterlySubscription: 7999,
    features: ['Advanced testing', 'Priority support', 'Detailed report']
  }
];

// Add-on Services
export const addOnServices: AddOnService[] = [
  // Water Quality Testing
  {
    id: 'basic-test',
    name: 'Basic Water Test',
    price: 199,
    description: 'pH and TDS testing',
    category: 'testing'
  },
  {
    id: 'advanced-test',
    name: 'Advanced Water Test',
    price: 399,
    description: 'pH, TDS, Bacteria, Hardness testing',
    category: 'testing'
  },
  {
    id: 'comprehensive-test',
    name: 'Comprehensive Water Test',
    price: 599,
    description: 'All parameters + detailed report',
    category: 'testing'
  },
  
  // Specialized Services
  {
    id: 'emergency-cleaning',
    name: 'Emergency Cleaning',
    price: 500,
    description: 'Within 24 hours service',
    category: 'service'
  },
  {
    id: 'weekend-holiday',
    name: 'Weekend/Holiday Service',
    price: 300,
    description: 'Saturday, Sunday or holiday service',
    category: 'service'
  },
  {
    id: 'tank-repair',
    name: 'Minor Tank Repair',
    price: 999,
    description: 'Basic repairs and maintenance',
    category: 'service'
  },
  {
    id: 'installation',
    name: 'New Tank Installation',
    price: 1999,
    description: 'Complete new tank setup',
    category: 'service'
  },
  
  // Digital Services
  {
    id: 'digital-certificate',
    name: 'Digital Certificate',
    price: 199,
    description: 'Lifetime validity digital certificate',
    category: 'digital'
  },
  {
    id: 'priority-support',
    name: 'Priority Support',
    price: 299,
    description: 'Monthly priority support',
    category: 'digital'
  },
  {
    id: 'mobile-app',
    name: 'Mobile App Access',
    price: 99,
    description: 'Monthly mobile app premium features',
    category: 'digital'
  },
  {
    id: 'sms-alerts',
    name: 'SMS Alerts',
    price: 49,
    description: 'Monthly SMS notification service',
    category: 'digital'
  }
];

// Subscription Plans
export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'basic-monthly',
    name: 'Basic Monthly',
    duration: 'monthly',
    price: 299,
    cleanings: 1,
    features: ['Basic cleaning', 'Photo proof', 'Email support']
  },
  {
    id: 'premium-monthly',
    name: 'Premium Monthly',
    duration: 'monthly',
    price: 499,
    cleanings: 1,
    features: ['Deep cleaning', 'Water testing', 'Priority support', 'Digital certificate']
  },
  {
    id: 'basic-annual',
    name: 'Basic Annual',
    duration: 'annual',
    price: 1499,
    cleanings: 4,
    features: ['4 basic cleanings', 'Photo proof', 'Digital access', 'Email reminders'],
    popular: true
  },
  {
    id: 'premium-annual',
    name: 'Premium Annual',
    duration: 'annual',
    price: 2499,
    cleanings: 4,
    features: ['4 deep cleanings', 'Water testing', 'Priority support', 'Digital certificate', 'SMS reminders']
  },
  {
    id: 'commercial-quarterly',
    name: 'Commercial Quarterly',
    duration: 'quarterly',
    price: 3999,
    cleanings: 4,
    features: ['4 cleanings', 'Priority support', 'Detailed reports', 'Account manager']
  }
];

// Emergency Service Pricing
export const emergencyPricing = {
  sameDay: {
    name: 'Same Day Emergency',
    surcharge: 500,
    description: 'Service within 24 hours'
  },
  weekend: {
    name: 'Weekend Service',
    surcharge: 300,
    description: 'Saturday/Sunday service'
  },
  holiday: {
    name: 'Holiday Service',
    surcharge: 300,
    description: 'Public holiday service'
  },
  urgent: {
    name: 'Urgent Emergency',
    surcharge: 1000,
    description: 'Service within 6 hours'
  }
};

// Bulk Pricing Discounts
export const bulkDiscounts = [
  { minTanks: 5, maxTanks: 10, discount: 10 },
  { minTanks: 11, maxTanks: 20, discount: 15 },
  { minTanks: 21, maxTanks: Infinity, discount: 20 }
];

// Pricing Calculator Functions
export function calculateSimplePrice(planName: string): number {
  const plan = simpleHomePricing.find(p => p.name === planName);
  return plan ? plan.price : 0;
}

export function calculateTankPrice(
  tankType: 'simple' | 'capacity' | 'commercial',
  tankIndex: number,
  serviceType: 'basic' | 'deep',
  isSubscription: boolean = false
): number {
  if (tankType === 'simple') {
    // For simple pricing, return the basic plan price or one-time clean price
    if (serviceType === 'basic') {
      return calculateSimplePrice('Basic Plan');
    } else {
      return calculateSimplePrice('Premium Plan');
    }
  }

  if (tankType === 'capacity') {
    const pricing = tankCapacityPricing[tankIndex];
    const basePrice = serviceType === 'basic' ? pricing.basicClean : pricing.deepClean;
    
    if (isSubscription) {
      return pricing.annualSubscription;
    }
    
    return basePrice;
  }

  // Commercial pricing
  const pricing = commercialTankPricing[tankIndex];
  const basePrice = serviceType === 'basic' ? pricing.basicClean : pricing.deepClean;
  
  if (isSubscription) {
    return pricing.quarterlySubscription;
  }
  
  return basePrice;
}

export function getTankPricingInfo(tankType: 'simple' | 'capacity' | 'commercial', tankIndex: number) {
  if (tankType === 'simple') {
    return {
      type: 'simple',
      name: 'Standard Home Tank (Up to 500L)',
      description: 'Perfect for regular home water tanks',
      basicPlan: simpleHomePricing.find(p => p.name === 'Basic Plan'),
      premiumPlan: simpleHomePricing.find(p => p.name === 'Premium Plan'),
      oneTimeClean: simpleHomePricing.find(p => p.name === 'One-Time Clean')
    };
  }

  if (tankType === 'capacity') {
    return {
      type: 'capacity',
      ...tankCapacityPricing[tankIndex]
    };
  }

  return {
    type: 'commercial',
    ...commercialTankPricing[tankIndex]
  };
}

export function calculateTotalPrice(
  basePrice: number,
  addOns: string[] = [],
  emergencyType?: string,
  discountPercentage: number = 0
): number {
  let total = basePrice;
  
  // Add add-on services
  addOns.forEach(addOnId => {
    const addOn = addOnServices.find(service => service.id === addOnId);
    if (addOn) {
      total += addOn.price;
    }
  });
  
  // Add emergency surcharge
  if (emergencyType && emergencyPricing[emergencyType as keyof typeof emergencyPricing]) {
    total += emergencyPricing[emergencyType as keyof typeof emergencyPricing].surcharge;
  }
  
  // Apply discount
  if (discountPercentage > 0) {
    total = total * (1 - discountPercentage / 100);
  }
  
  return Math.round(total);
}

export function calculateBulkDiscount(tankCount: number): number {
  const discount = bulkDiscounts.find(d => tankCount >= d.minTanks && tankCount <= d.maxTanks);
  return discount ? discount.discount : 0;
}

// Dynamic Pricing Adjustments
export const seasonalPricing = {
  monsoon: {
    name: 'Monsoon Season',
    adjustment: 1.2, // +20%
    months: [6, 7, 8, 9] // June to September
  },
  winter: {
    name: 'Winter Season',
    adjustment: 0.85, // -15%
    months: [11, 12, 1, 2] // November to February
  },
  normal: {
    name: 'Normal Season',
    adjustment: 1.0,
    months: [3, 4, 5, 10] // March, April, May, October
  }
};

export function getSeasonalAdjustment(): number {
  const currentMonth = new Date().getMonth() + 1;
  
  for (const season of Object.values(seasonalPricing)) {
    if (season.months.includes(currentMonth)) {
      return season.adjustment;
    }
  }
  
  return 1.0;
}

export function applySeasonalPricing(basePrice: number): number {
  const adjustment = getSeasonalAdjustment();
  return Math.round(basePrice * adjustment);
}

// Promotional Pricing
export const promotions = {
  introductory: {
    name: 'Introductory Offer',
    discount: 20, // 20% off
    description: 'First cleaning service',
    validFor: 'new-customers'
  },
  advanceBooking: {
    name: 'Advance Booking Discount',
    discount: 10, // 10% off
    description: 'Book 30 days in advance',
    validFor: 'advance-30days'
  },
  referral: {
    name: 'Referral Credit',
    discount: 200, // ₹200 credit
    description: 'Refer a friend',
    validFor: 'referral-program'
  }
};

// QR Code Pricing
export const qrCodePricing = {
  sticker: {
    price: 499,
    description: 'Printable QR sticker for your tank',
    features: ['Printable QR sticker', 'Online tracking', 'Lifetime validity']
  },
  renewal: {
    price: 199,
    description: 'Annual renewal for digital services',
    features: ['Online tracking', 'Digital access', 'Email/SMS reminders']
  }
};

// Export all pricing data
export const pricingData = {
  simple: simpleHomePricing,
  capacity: tankCapacityPricing,
  commercial: commercialTankPricing,
  addOns: addOnServices,
  subscriptions: subscriptionPlans,
  emergency: emergencyPricing,
  bulkDiscounts,
  seasonal: seasonalPricing,
  promotions,
  qrCode: qrCodePricing
};