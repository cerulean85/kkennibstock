// lib/i18n.ts
export async function getMessages(locale: string) {
    try {
      return (await require(`../locales/${locale}.json`));
    } catch (error) {
      console.error(`번역 파일을 찾을 수 없습니다: ${locale}`);
      return {};
    }
  }

  export function getEndpointFromURL(url: string) {
    const urlArr = url.split('/');
    if (urlArr.length === 0) return '';
    return urlArr[urlArr.length - 1];
  }

  export function getMenunameFromURL(url: string) {
    const urlArr = url.split('/');
    if (urlArr.length < 2) return '';
    return urlArr[urlArr.length - 2];
  }
  
  export const locales = ['en', 'ko', 'cn']; // 지원하는 언어 목록
  export const defaultLocale = 'ko';   // 기본 언어
  export const defaultPage = 'dashboard/db_factory';
  export const notfoundPage = 'notfound';
  