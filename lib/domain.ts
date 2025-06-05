// lib/i18n.ts
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
  
  export const locales = ['en', 'ko']; // 지원하는 언어 목록
  export const defaultPage = 'profit';
  export const notfoundPage = 'notfound';
  export const noAuthEndpoints = ['signup', 'find_acc', notfoundPage];