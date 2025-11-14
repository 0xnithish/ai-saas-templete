import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    
    // Simulate webhook processing
    console.log('Test webhook payload received:', payload);
    
    return NextResponse.json({
      success: true,
      message: `Webhook endpoint is working. Received event type: ${payload.type}`,
      received: payload,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
