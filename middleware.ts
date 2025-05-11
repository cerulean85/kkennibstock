import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 루트 경로일 경우 /metrics로 리다이렉트
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/metrics', req.url));
  }

  const pathArr = pathname.split('/');
  const firstPath = pathArr[1];
  const enabledPaths = ["images", "maps", "profit", "metrics"];

  if (enabledPaths.includes(firstPath)) {
    return NextResponse.next();
  } else {
    return NextResponse.redirect(new URL('/notfound', req.url));
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
