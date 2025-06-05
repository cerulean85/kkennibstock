import { ReactNode } from 'react';
import ProviderWrapper from '@/components/ProviderWrapper';

import MemberSection from '@/layouts/main_member';

export default async function UpdatePasswordLayout({ children, params }: { children: ReactNode; params: any }) {
  const _p = await params;

  return (
    <ProviderWrapper>
      <html lang={_p.locale}>
        <head>
          <title>Stock DEV: Update Password</title>
        </head>
        <body style={{ backgroundColor: 'var(--main-bg-color)' }} className="min-h-screen">
          <div className="flex">
            <div className="hidden sm:block w-[calc(100%-420px)] bg-[url('/images/background/bg-inv.jpg')] bg-cover bg-no-repeat bg-center"></div>
            <div
              className="min-w-[420px] w-[420px] items-center justify-center bg-white">
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
