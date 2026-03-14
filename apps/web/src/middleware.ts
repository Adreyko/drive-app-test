import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { AUTH_TOKEN_COOKIE_NAME } from '@/lib/auth/constants';

const authRoutes = new Set(['/login', '/register']);

export function middleware(request: NextRequest) {
  const token = request.cookies.get(AUTH_TOKEN_COOKIE_NAME)?.value;
  const { pathname, search } = request.nextUrl;

  if (pathname.startsWith('/dashboard') && !token) {
    const loginUrl = new URL('/login', request.url);

    loginUrl.searchParams.set('redirect', `${pathname}${search}`);

    return NextResponse.redirect(loginUrl);
  }

  if (authRoutes.has(pathname) && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};
