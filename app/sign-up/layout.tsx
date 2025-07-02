import { ReactNode } from "react";
import "@/styles/common.scss";
import "@/styles/signin.scss";

import MemberSection from "@/layouts/main_member";

export default async function SignUpLayout({ children, params }: { children: ReactNode; params: any }) {
  const _p = await params;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* 6:4 분할 - 왼쪽 6(배경), 오른쪽 4(로그인) */}
        <div className="hidden sm:block w-[calc(100%-420px)] bg-[url('/images/background/bg-inv.jpg')] bg-cover bg-no-repeat bg-center"></div>
        <div className="min-w-[420px] w-[420px] items-center justify-center bg-white">
          <MemberSection locale={_p.locale}>{children}</MemberSection>
        </div>
      </div>
    </div>
  );
}
