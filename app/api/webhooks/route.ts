import { NextResponse } from 'next/server';

// Redirect legacy webhook endpoint to the new Better Auth endpoint
export async function POST(request: Request) {
  // Redirect to the proper Dodo Payments webhook handler in Better Auth
  const url = new URL('/api/auth/dodopayments/webhooks', request.url);
  url.search = new URL(request.url).search;
  
  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Forwarded-For': request.headers.get('forwarded-for') || '',
      'User-Agent': request.headers.get('user-agent') || '',
    },
    body: request.body,
  });

  const data = await response.text();
  
  return new NextResponse(data, {
    status: response.status,
    headers: {
      'Content-Type': response.headers.get('content-type') || 'application/json',
    },
  });
}
