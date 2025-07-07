import ProviderWrapper from "@/components/ProviderWrapper";
import HydrationBoundary from "@/components/HydrationBoundary";
import "./globals.css";
import ClientRootLayout from "@/components/ClientRootLayout";
import { headers } from "next/headers";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 현재 경로 확인
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";

  // 디버깅 로그
  console.log("🔍 Layout pathname:", pathname);

  // 로그인/사인업/비밀번호 변경 페이지인지 확인
  const isAuthPage =
    pathname.startsWith("/log-in") || pathname.startsWith("/sign-up") || pathname.startsWith("/update-pwd");

  console.log("🔍 Is auth page:", isAuthPage);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-gray-50" suppressHydrationWarning>
        <ProviderWrapper>
          <HydrationBoundary>
            {isAuthPage ? (
              // 인증 페이지: ClientRootLayout 없이
              <div className="min-h-screen">{children}</div>
            ) : (
              // 일반 페이지: ClientRootLayout 포함
              <ClientRootLayout>{children}</ClientRootLayout>
            )}
          </HydrationBoundary>
        </ProviderWrapper>
      </body>
    </html>
  );
}
