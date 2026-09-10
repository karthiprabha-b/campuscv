import { NextRequest, NextResponse } from 'next/server';
import { normalizeDomain, isReservedDomain } from './lib/domainUtils';

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - api routes (direct stream handling)
     * - uploads and static files
     * - favicon.ico, icon.png, robots.txt, sitemap.xml
     */
    '/((?!_next/static|_next/image|api|uploads|favicon.ico|icon.png|robots.txt|sitemap.xml).*)',
  ],
};

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const rawHost = req.headers.get('x-forwarded-host') || req.headers.get('host') || '';
  const normalizedHost = normalizeDomain(rawHost);

  // 1. Pass through all system / internal / reserved hosts (e.g. portfolio.campuscv.com, localhost:3000)
  if (!normalizedHost || isReservedDomain(normalizedHost)) {
    // Security: Do NOT allow direct browser access to the internal /custom-domain route on CampusCV's host
    if (url.pathname.startsWith('/custom-domain')) {
      return NextResponse.rewrite(new URL('/not-found', req.url));
    }
    return NextResponse.next();
  }

  // 2. Pass through asset and API routes so uploaded images, templates, and analytics work seamlessly
  const pathname = url.pathname;
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/uploads') ||
    pathname.startsWith('/template-assets') ||
    pathname.startsWith('/template-files') ||
    pathname.startsWith('/assets') ||
    pathname.startsWith('/_next')
  ) {
    return NextResponse.next();
  }

  // 3. For any custom domain webpage request, rewrite internally to `/custom-domain/[domain]`
  // The user's browser address bar will stay at https://legalpanelindia.com/
  const search = url.search || '';
  const rewriteUrl = new URL(`/custom-domain/${normalizedHost}${pathname}${search}`, req.url);

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-custom-domain', normalizedHost);

  const response = NextResponse.rewrite(rewriteUrl, {
    request: {
      headers: requestHeaders,
    },
  });

  // Also set on response header
  response.headers.set('x-custom-domain', normalizedHost);

  return response;
}
