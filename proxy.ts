import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhook/clerk',
])

// Subdomain routing function
function handleSubdomainRouting(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  
  // Check if request is from dashboard subdomain
  if (hostname === 'dashboard.website.com' || hostname.startsWith('dashboard.localhost')) {
    // Rewrite dashboard subdomain to /dashboard route
    const url = request.nextUrl.clone()
    url.pathname = `/dashboard${url.pathname}`
    
    return NextResponse.rewrite(url)
  }
  
  return NextResponse.next()
}

export default clerkMiddleware(async (auth, req: NextRequest) => {
  // First, handle subdomain routing
  const subdomainResponse = handleSubdomainRouting(req)
  if (subdomainResponse.headers.get('x-middleware-rewrite')) {
    // If middleware rewrote the URL, continue with auth check on the rewritten path
  }
  
  // Then, check authentication
  if (!isPublicRoute(req)) {
    await auth.protect()
  }
  
  return subdomainResponse
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}