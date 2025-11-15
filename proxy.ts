import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSessionCookie } from 'better-auth/cookies'

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/sign-in',
  '/sign-up',
  '/forgot-password',
  '/reset-password',
  '/api/auth',
]

// Check if a path matches public routes
function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  )
}

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

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  
  // Handle subdomain routing first
  const subdomainResponse = handleSubdomainRouting(req)
  
  // Allow public routes
  if (isPublicRoute(pathname)) {
    return subdomainResponse
  }
  
  // For protected routes, check if user has a session cookie
  // Using Better Auth's recommended getSessionCookie helper
  // NOTE: This only checks for cookie existence, not validity
  // Actual session validation happens in ProtectedRoute components
  const sessionCookie = getSessionCookie(req)
  
  // If no session cookie and trying to access protected route, redirect to sign-in
  if (!sessionCookie) {
    const signInUrl = new URL('/sign-in', req.url)
    signInUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(signInUrl)
  }
  
  return subdomainResponse
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}