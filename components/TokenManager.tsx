"use client";
import { useEffect } from "react";
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { validateToken } from '@/lib/utils';
import { useRouter, usePathname } from 'next/navigation';
import { noAuthEndpoints, getEndpointFromURL } from "@/lib/domain";

function scheduleTokenRefresh(accessToken: string, refreshToken: string, redirectPath: string) {
  try {
    const decoded: any = jwtDecode(accessToken);
    const currentTime = Math.floor(Date.now() / 1000); // 현재 시간 (초 단위)
    const timeUntilExpiry = decoded.exp - currentTime; // 만료까지 남은 시간 (초 단위)

    // 만료 5분 전에만 갱신 요청 스케줄링
    // console.log("scheduleTokenRefresh 실행");
    // console.log(timeUntilExpiry)
    const refreshTime = timeUntilExpiry - 20; // 300초 = 5분

    if (refreshTime > 0) {
      // console.log("setTimeout 등록 " + refreshTime );
      setTimeout(async () => {
        try {
          // console.log("refreshToken => ");
          // console.log(refreshToken)
          const response = await axios.post('users/refresh', { 'refreshToken': refreshToken });
          // console.log("accessToken => ");
          // console.log(response.data)
          const newAccessToken = response.data.accessToken;
          localStorage.setItem('accessToken', newAccessToken);
          scheduleTokenRefresh(newAccessToken, refreshToken, redirectPath); // 새 토큰으로 다시 스케줄링
        } catch (error) {
          console.error('토큰 갱신 실패:', error);
          // 로그아웃 처리 또는 로그인 페이지로 리다이렉트
          window.location.href = redirectPath;
        }
      }, refreshTime * 1000); // 밀리초 단위로 변환
    }
  } catch (error) {
    console.error('토큰 디코딩 실패:', error);
  }
}

export default function TokenManager({ redirectPath }: { redirectPath: string }) {

  const router = useRouter();
  const pathname = usePathname();
  const endpoint = getEndpointFromURL(pathname);
  if(noAuthEndpoints.includes(endpoint)) return;

  useEffect(() => {

    
    // 액세스토큰 체크
    // const accessToken = localStorage.getItem("accessToken");
    // console.log("accessToken")
    // console.log(accessToken)
    // const refreshToken = localStorage.getItem("refreshToken");
    // if (!accessToken || accessToken.length == 0) {
    //   router.push(redirectPath); 
    //   return;
    // }

    // const isValid = validateToken(accessToken);
    // if (!isValid) {
    //   router.push(redirectPath); 
    //   return;
    // }
  
    // if (accessToken && refreshToken) {
    //   scheduleTokenRefresh(accessToken, refreshToken, redirectPath);
    // }

  }, []);

  return null; // UI를 렌더링하지 않음
}