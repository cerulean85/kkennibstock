import { ReactNode } from 'react';
import ProviderWrapper from '@/components/ProviderWrapper';
import "@/styles/common.scss"
import "@/styles/signin.scss"

import MemberSection from '@/layouts/main_member';

export default async function SigninPageLayout({ children, params }: { children: ReactNode; params: any }) {
  const _p = await params;

  return (
    <ProviderWrapper>
      <html lang={_p.locale}>
        <head>
          <title>LING LONG: Login</title>
        </head>
        <body style={{ backgroundColor: 'var(--main-bg-color)' }} className="min-h-screen">
          <div className="flex">
            {/* 6:4 분할 - 왼쪽 6(배경), 오른쪽 4(로그인) */}
            <div className="hidden sm:block w-[calc(100%-420px)] bg-[url('/images/background/bg-inv.jpg')] bg-cover bg-no-repeat bg-center"></div>
            <div
              className="min-w-[420px] w-[420px] items-center justify-center">
              <MemberSection locale={_p.locale}>
                {children}
              </MemberSection>
            </div>
          </div>
        </body>
      </html>
    </ProviderWrapper>
  );
}
