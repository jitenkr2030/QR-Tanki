import { NextRequest, NextResponse } from 'next/server';
import { 
  calculateTankPrice, 
  calculateTotalPrice, 
  calculateBulkDiscount,
  applySeasonalPricing,
  pricingData 
} from '@/lib/pricing';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      tankType = 'residential',
      tankIndex = 0,
      serviceType = 'basic',
      isSubscription = false,
      selectedAddOns = [],
      emergencyType = '',
      tankCount = 1
    } = body;

    // Validate input
    if (tankType !== 'residential' && tankType !== 'commercial') {
      return NextResponse.json(
        { error: 'Invalid tank type. Must be residential or commercial.' },
        { status: 400 }
      );
    }

    if (serviceType !== 'basic' && serviceType !== 'deep') {
      return NextResponse.json(
        { error: 'Invalid service type. Must be basic or deep.' },
        { status: 400 }
      );
    }

    const pricing = tankType === 'residential' 
      ? pricingData.residential 
      : pricingData.commercial;

    if (tankIndex < 0 || tankIndex >= pricing.length) {
      return NextResponse.json(
        { error: 'Invalid tank index.' },
        { status: 400 }
      );
    }

    // Calculate base price
    let basePrice = calculateTankPrice(tankType, tankIndex, serviceType, isSubscription);
    
    // Apply seasonal pricing
    const seasonalPrice = applySeasonalPricing(basePrice);
    
    // Calculate total for multiple tanks
    let totalPrice = seasonalPrice * tankCount;
    
    // Add add-on services (per tank)
    let addOnsTotal = 0;
    const validAddOns = [];
    
    selectedAddOns.forEach(addOnId => {
      const addOn = pricingData.addOns.find(service => service.id === addOnId);
      if (addOn) {
        addOnsTotal += addOn.price * tankCount;
        validAddOns.push({
          id: addOn.id,
          name: addOn.name,
          price: addOn.price,
          total: addOn.price * tankCount
        });
      }
    });
    
    totalPrice += addOnsTotal;
    
    // Add emergency surcharge (one time)
    let emergencyCharge = 0;
    let emergencyDetails = null;
    
    if (emergencyType && pricingData.emergency[emergencyType as keyof typeof pricingData.emergency]) {
      emergencyCharge = pricingData.emergency[emergencyType as keyof typeof pricingData.emergency].surcharge;
      totalPrice += emergencyCharge;
      emergencyDetails = {
        type: emergencyType,
        name: pricingData.emergency[emergencyType as keyof typeof pricingData.emergency].name,
        surcharge: emergencyCharge
      };
    }
    
    // Apply bulk discount
    const discountPercentage = calculateBulkDiscount(tankCount);
    let discountAmount = 0;
    
    if (discountPercentage > 0) {
      discountAmount = Math.round(totalPrice * discountPercentage / 100);
      totalPrice -= discountAmount;
    }
    
    // Get seasonal adjustment info
    const currentMonth = new Date().getMonth() + 1;
    let seasonalInfo = { name: 'Normal', adjustment: 1.0 };
    
    if ([6, 7, 8, 9].includes(currentMonth)) {
      seasonalInfo = { name: 'Monsoon', adjustment: 1.2 };
    } else if ([11, 12, 1, 2].includes(currentMonth)) {
      seasonalInfo = { name: 'Winter', adjustment: 0.85 };
    }

    const response = {
      success: true,
      pricing: {
        tankType,
        tankInfo: pricing[tankIndex],
        serviceType,
        isSubscription,
        tankCount,
        basePrice,
        seasonalPrice,
        seasonalAdjustment: seasonalInfo,
        addOns: validAddOns,
        addOnsTotal,
        emergency: emergencyDetails,
        emergencyCharge,
        subtotal: seasonalPrice * tankCount + addOnsTotal + emergencyCharge,
        discount: {
          percentage: discountPercentage,
          amount: discountAmount
        },
        totalPrice: Math.round(totalPrice),
        breakdown: {
          baseService: seasonalPrice * tankCount,
          addOnServices: addOnsTotal,
          emergencyService: emergencyCharge,
          discount: -discountAmount,
          total: Math.round(totalPrice)
        }
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Pricing calculation error:', error);
    return NextResponse.json(
      { error: 'Internal server error during pricing calculation' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Return available pricing options
    const response = {
      success: true,
      data: {
        residential: pricingData.residential.map(tank => ({
          size: tank.size,
          capacity: tank.capacity,
          basicClean: tank.basicClean,
          deepClean: tank.deepClean,
          annualSubscription: tank.annualSubscription
        })),
        commercial: pricingData.commercial.map(tank => ({
          size: tank.size,
          capacity: tank.capacity,
          basicClean: tank.basicClean,
          deepClean: tank.deepClean,
          quarterlySubscription: tank.quarterlySubscription
        })),
        addOns: pricingData.addOns.map(addOn => ({
          id: addOn.id,
          name: addOn.name,
          price: addOn.price,
          description: addOn.description,
          category: addOn.category
        })),
        emergency: Object.entries(pricingData.emergency).map(([key, service]) => ({
          id: key,
          name: service.name,
          surcharge: service.surcharge,
          description: service.description
        })),
        bulkDiscounts: pricingData.bulkDiscounts,
        subscriptions: pricingData.subscriptions
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Pricing data error:', error);
    return NextResponse.json(
      { error: 'Internal server error fetching pricing data' },
      { status: 500 }
    );
  }
}