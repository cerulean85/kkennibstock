"use client";

import { ReactNode, useEffect } from "react";

export default function HydrationBoundary({ children }: { children: ReactNode }) {
  useEffect(() => {
    // 클라이언트에서만 실행되는 로직으로 하이드레이션 후 정리
    const body = document.body;
    if (body && body.style.length === 0) {
      body.removeAttribute('style');
    }
  }, []);

  return <div suppressHydrationWarning>{children}</div>;
}
