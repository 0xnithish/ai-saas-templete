import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check if the checkout endpoint configuration is valid
    const hasAccessToken = !!process.env.POLAR_ACCESS_TOKEN;
    
    if (!hasAccessToken) {
      throw new Error('POLAR_ACCESS_TOKEN is not configured');
    }
    
    return NextResponse.json({
      success: true,
      message: 'Checkout endpoint is configured correctly',
      endpoint: '/api/checkout',
      successUrl: '/confirmation?checkout_id={CHECKOUT_ID}',
      server: 'sandbox',
      accessTokenConfigured: true,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
