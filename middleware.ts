import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 현재 경로를 헤더에 추가
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', request.nextUrl.pathname);

  console.log('🔍 Middleware pathname:', request.nextUrl.pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    // 모든 페이지에 적용 (API, static 파일 제외)
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};