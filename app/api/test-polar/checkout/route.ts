import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check if the checkout endpoint configuration is valid
    const accessToken = process.env.POLAR_ACCESS_TOKEN;
    
    if (!accessToken) {
      throw new Error('POLAR_ACCESS_TOKEN is not configured');
    }
    
    // Return success with the checkout endpoint URL
    // The actual checkout is handled by /api/checkout which uses @polar-sh/nextjs
    const checkoutUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/checkout`;
    
    return NextResponse.json({
      success: true,
      checkoutUrl,
      message: 'Checkout endpoint is configured correctly',
      note: 'Use the /api/checkout endpoint with product price IDs to create checkout sessions',
      server: 'sandbox',
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
