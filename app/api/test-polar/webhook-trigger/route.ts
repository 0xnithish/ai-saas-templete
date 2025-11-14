import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const webhookSecret = process.env.POLAR_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      throw new Error('Missing POLAR_WEBHOOK_SECRET');
    }
    
    // Check if we have a public URL configured
    const publicUrl = process.env.NEXT_PUBLIC_APP_URL;
    
    if (!publicUrl || publicUrl.includes('localhost')) {
      return NextResponse.json({
        success: false,
        error: 'No public URL detected. Start ngrok to test webhooks from Polar.',
        instructions: [
          '1. Run: ngrok http 3000',
          '2. Copy your ngrok URL (e.g., https://xxxx.ngrok-free.dev)',
          '3. Go to Polar Dashboard → Settings → Webhooks',
          '4. Add webhook: https://xxxx.ngrok-free.dev/api/webhook/polar',
          '5. Create a test checkout in Polar to trigger the webhook'
        ],
      });
    }
    
    // If we have a public URL, guide user to configure Polar webhook
    const webhookUrl = `${publicUrl}/api/webhook/polar`;
    
    return NextResponse.json({
      success: true,
      message: `Public URL detected: ${publicUrl}`,
      webhookUrl,
      instructions: [
        '1. Go to Polar Dashboard → Settings → Webhooks',
        `2. Add webhook endpoint: ${webhookUrl}`,
        '3. Select events: checkout.updated, order.created, subscription.created',
        '4. Save the webhook',
        '5. Create a test checkout to trigger a real webhook'
      ],
      note: 'To test: Create a checkout in Polar and watch your terminal for webhook logs',
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
