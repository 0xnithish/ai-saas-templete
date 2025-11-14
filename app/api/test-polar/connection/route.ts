import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check if the Polar API client can be instantiated
    const hasAccessToken = !!process.env.POLAR_ACCESS_TOKEN;
    
    if (!hasAccessToken) {
      throw new Error('POLAR_ACCESS_TOKEN is not configured');
    }
    
    // Test if the Polar SDK can be imported and initialized
    const { Polar } = await import('@polar-sh/sdk');
    const polarApi = new Polar({
      accessToken: process.env.POLAR_ACCESS_TOKEN!,
      server: 'sandbox',
    });
    
    return NextResponse.json({
      success: true,
      server: 'sandbox',
      message: 'Polar API client initialized successfully',
      accessTokenConfigured: true,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
