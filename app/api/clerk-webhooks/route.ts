import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/db/supabase';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    // Get Clerk webhook secret from environment
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      console.error('CLERK_WEBHOOK_SECRET is not configured');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    // Get the raw body and signature for verification
    const body = await request.text();
    const svixId = request.headers.get('svix-id');
    const svixTimestamp = request.headers.get('svix-timestamp');
    const svixSignature = request.headers.get('svix-signature');

    // Verify webhook signature
    if (!svixId || !svixTimestamp || !svixSignature) {
      console.error('Missing required webhook headers');
      return NextResponse.json(
        { error: 'Missing required webhook headers' },
        { status: 400 }
      );
    }

    const timestamp = new Date(parseInt(svixTimestamp) * 1000);
    if (timestamp < new Date(Date.now() - 5 * 60 * 1000)) {
      console.error('Webhook timestamp is too old');
      return NextResponse.json(
        { error: 'Webhook timestamp is too old' },
        { status: 400 }
      );
    }

    // Create the signed content
    const signedContent = `${svixId}.${svixTimestamp}.${body}`;
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(signedContent)
      .digest('base64');

    if (svixSignature !== expectedSignature) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 }
      );
    }

    // Parse the webhook payload
    const payload = JSON.parse(body);
    const { type, data } = payload;

    console.log('Received Clerk webhook:', type, data.id);

    // Handle user.updated events
    if (type === 'user.updated') {
      await handleUserUpdated(data);
    }
    // Handle user.created events
    else if (type === 'user.created') {
      await handleUserCreated(data);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handleUserUpdated(userData: any) {
  try {
    console.log('Processing user.updated event for:', userData.id);

    // Extract relevant user data
    const userId = userData.id;
    const email = userData.email_addresses?.[0]?.email_address;
    const firstName = userData.first_name;
    const lastName = userData.last_name;
    const imageUrl = userData.image_url;

    if (!email) {
      console.error('User has no email address:', userId);
      return;
    }

    // Get Supabase admin client
    const supabase = getSupabaseAdmin();

    // Update user profile in Supabase
    const profileData = {
      clerk_id: userId,
      email: email,
      first_name: firstName,
      last_name: lastName,
      avatar_url: imageUrl,
      updated_at: new Date().toISOString(),
    };

    console.log('Updating profile in Supabase:', profileData);

    const { data, error } = await supabase
      .from('profiles')
      .upsert(profileData, {
        onConflict: 'clerk_id',
        ignoreDuplicates: false,
      })
      .select()
      .single();

    if (error) {
      console.error('Error updating profile in Supabase:', error);
      throw error;
    }

    console.log('Profile successfully synced to Supabase:', data);

  } catch (error) {
    console.error('Error in handleUserUpdated:', error);
    throw error;
  }
}

async function handleUserCreated(userData: any) {
  // For new users, we can use the same logic as updated
  // This ensures profiles are created in Supabase when users sign up
  return handleUserUpdated(userData);
}

// Support HEAD requests for webhook health checks
export async function HEAD() {
  return new NextResponse(null, { status: 200 });
}
