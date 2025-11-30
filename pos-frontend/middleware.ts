import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('authToken');
  const { pathname } = request.nextUrl;

  // Define protected routes that require authentication
  const protectedRoutes = ['/', '/pos', '/products'];

  // Redirect to login if trying to access protected route without token
  if (protectedRoutes.includes(pathname) && !authToken) {
    // If the requested path is the root, and we don't have a token,
    // we also check if the user is trying to access /pos or /products.
    // If so, redirect to login.
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Redirect from login to home if already authenticated
  if (pathname === '/login' && authToken) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Match all paths except API routes, static files, and _next/static, _next/image, etc.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
