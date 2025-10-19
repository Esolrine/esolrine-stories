import { withAuth } from 'next-auth/middleware';
import { NextRequest, NextResponse } from 'next/server';

export default withAuth(
  function middleware(request: NextRequest) {
    // Get locale from cookie (set by LocaleSwitcher)
    const locale = request.cookies.get('NEXT_LOCALE')?.value || 'en';

    // Store in header for server components to access
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-locale', locale);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    '/admin/((?!login).*)', // Protect /admin/* except /admin/login
    '/api/stories/:path*',
    '/api/upload/:path*'
  ],
};
