import { ReactNode } from "react";
import "@/styles/common.scss";
import "@/styles/signin.scss";

import MemberSection from "@/layouts/main_member";

export default async function LoginPageLayout({ children, params }: { children: ReactNode; params: any }) {
  const _p = await params;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <div className="hidden sm:block w-[calc(100%-420px)] bg-[url('/images/background/bg-inv.jpg')] bg-cover bg-no-repeat bg-center"></div>
        <div className="min-w-[420px] w-[420px] items-center justify-center">
          <MemberSection locale={_p.locale}>{children}</MemberSection>
        </div>
      </div>
    </div>
  );
}