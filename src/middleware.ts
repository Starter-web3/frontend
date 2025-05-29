import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Get stored token and role from cookies
  const token = request.cookies.get('token')?.value;
  const role = request.cookies.get('role')?.value;

  // Define public paths that don't require authentication
  const publicPaths = [
    '/',
    '/user-registration',
    '/email-verification',
    '/api/auth/register',
    '/api/auth/verify-email',
    '/api/auth/resend-otp',
    '/api/auth/login'
  ];

  // Check if the path is public
  const isPublicPath = publicPaths.some(publicPath => 
    path === publicPath || path.startsWith('/api/auth/') || path.startsWith('/_next/')
  );

  // If it's a dashboard route and user is not authenticated
  if (path.startsWith('/dashboard') && !token) {
    // Redirect to home page
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If user is authenticated but trying to access auth pages
  if (token && (path === '/user-registration' || path === '/email-verification')) {
    // Redirect to appropriate dashboard based on role
    if (role === 'owner') {
      return NextResponse.redirect(new URL('/dashboard/token-creator', request.url));
    } else if (role === 'user') {
      return NextResponse.redirect(new URL('/dashboard/token-trader', request.url));
    }
  }

  // Allow the request to continue
  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api/auth/* (authentication routes)
     * 2. /_next/* (Next.js internals)
     * 3. /static/* (static files)
     * 4. /favicon.ico, /site.webmanifest, etc. (favicon and site manifest)
     */
    '/((?!api/auth|_next/static|_next/image|static|favicon.ico|site.webmanifest).*)',
  ],
}; 