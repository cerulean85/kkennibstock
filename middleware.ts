import { NextRequest, NextResponse } from 'next/server';
import { defaultPage, notfoundPage } from './lib/domain';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const pathArr = pathname.split('/');
    
  const pathList = [
    "images", "maps", "log-in", "sign-up", "update-password"
  ]

  if (pathArr.length < 2) {
      return NextResponse.redirect(new URL(`/${defaultPage}`, req.url));    
  }

  if (pathList.includes(pathArr[1])) {
    return NextResponse.next();
  } else {
    return NextResponse.redirect(new URL(`/${notfoundPage}`, req.url));
  }
  
  // const isValidLocale = locales.includes(pathLocale);

  // 올바른 로케일인 경우
  // if (isValidLocale) {

    // 경로가 '/:locale'인 경우 리다이렉트
    // if (pathArr.length === 2) {
    //   return NextResponse.redirect(new URL(`/${pathLocale}/${defaultPage}`, req.url));
    // }

    // const token: (string | undefined) = req.cookies.get('accessToken')?.value;
    // console.log('token: ', token);
    // const isValid = token ? validateToken(token) : false;
    // const endpoint = pathArr[pathArr.length - 1];

    // 토큰이 유효하고, 엔드포인트가 login인 경우 => 디폴트 페이지로 이동 (자동 로그인 인식)
    // if (isValid && endpoint === 'login') {
    //   return NextResponse.redirect(new URL(`/${pathLocale}/${defaultPage}`, req.url));
    // }

    // 토큰이 유효하지 않은데, 엔드포인트가 login인 경우 => 로그인이 필요
    // if (!isValid && endpoint === 'login') {
    //   return NextResponse.next();
    // }

    // 토큰이 유효하지 않아도 접근이 허용되는 경우 => 엔드포인트의 페이지를 그대로 노출
    // if (!isValid && noAuthEndpoints.includes(endpoint)) {
    //   return NextResponse.next();
    // }

    // 토큰이 유효하지 않은데, 토큰 인증을 요구하는, 일반적인 페이지에 대한 접근 => 로그인 페이지로 리다이렉트
    // if (!isValid) {
    //   const response = NextResponse.redirect(new URL(`/${pathLocale}/login`, req.url));
    //   response.cookies.set('jwtToken', '', { maxAge: 0 });
    //   return response;
    // }

  // } else {
    // 로케일이 없는 경우 기본 로케일로 리다이렉트
    // if (pathLocale === '') {
      // http://xxx.yyy.zzz와 같이 Locale이 없는 도메인으로 접근 시 기본 Locale로 리다이렉트
    //   return NextResponse.redirect(new URL(`/${defaultPage}`, req.url));
    // } 

    // 잘못된 로케일인 경우 '/not-found'로 리다이렉트
    // if (pathLocale !== notfoundPage) {
    //   return NextResponse.redirect(new URL(`/${notfoundPage}`, req.url));
    // }
  // }

  // return NextResponse.next();
}

// function validateToken(token: string): boolean {
//   try {
//     const payload = JSON.parse(atob(token.split('.')[1]));
//     return payload.exp * 1000 > Date.now(); // 만료 시간 확인
//   } catch (error) {
//     return false;
//   }
// }


export const config = {
  matcher: [
    /*
     * 다음과 같이 시작하는 경로를 제외한 모든 요청 경로와 일치:
     * - api (API 라우트)
     * - _next/static (정적 파일)
     * - _next/image (이미지 최적화 파일)
     * - favicon.ico (파비콘 파일)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    // matcher: ['/', '/:locale'] // 루트 경로에서만 실행
  ],
};