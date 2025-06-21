"use client";
import { useEffect } from "react";
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { validateToken } from '@/lib/utils';
import { useRouter, usePathname } from 'next/navigation';
import { noAuthEndpoints, getEndpointFromURL } from "@/lib/domain";
import { getLobbyPage, Page } from "@/lib/contant";
import { MemberService } from "@/services/MemberService";

// Schedule automatic token refresh before expiration
function scheduleTokenRefresh(accessToken: string, refreshToken: string, redirectPath: string) {
  try {
    const decoded: any = jwtDecode(accessToken);
    const currentTime = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = decoded.exp - currentTime;
    const refreshTime = timeUntilExpiry - 20; // 20 seconds before expiration
    if (refreshTime > 0) {
      setTimeout(async () => {
        try {
          const response = await axios.post('users/refresh', { refreshToken });
          const newAccessToken = response.data.accessToken;
          localStorage.setItem('accessToken', newAccessToken);
          scheduleTokenRefresh(newAccessToken, refreshToken, redirectPath);
        } catch (error) {
          console.error('Token refresh failed:', error);
          window.location.href = redirectPath;
        }
      }, refreshTime * 1000);
    }
  } catch (error) {
    console.error('Token decoding failed:', error);
  }
}

export default function TokenManager() {
  const redirectPath = '/' + Page.LogIn;
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    // If on a no-auth page and already logged in, redirect to lobby
    if (pathname){

      const pageName = getEndpointFromURL(pathname);
      if (pageName === Page.UpdatePassword) {      
        return;
      }

      if (noAuthEndpoints.includes(pageName as Page)) {
        if (accessToken && validateToken(accessToken)) {
          router.push(getLobbyPage());
        }
        return;
      }    
    }
    // If no token or token is invalid, logout and redirect to login page
    if (!accessToken || !validateToken(accessToken)) {
      new MemberService().logOut();
      router.push(redirectPath);
      return;
    }
    // Schedule token refresh
    if (accessToken && refreshToken) {
      scheduleTokenRefresh(accessToken, refreshToken, redirectPath);
    }
  }, [pathname]);

  return null;
}