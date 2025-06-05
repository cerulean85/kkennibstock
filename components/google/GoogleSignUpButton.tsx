import Image from "next/image";
import { useGoogleLogin } from '@react-oauth/google';
import { MemberService } from "@/services/MemberService";
import { setAllPageLoading } from "@/stores/appConfigSlice";
import { UseDispatch } from "@/stores/store";
import { useEffect, useState } from "react";
import { Account, getLobbyPage } from "@/lib/regacy";

export default function GoogleSignUpButton() {
  const dispatch = UseDispatch();
  const [result, setResult] = useState(false);
  useEffect(() => {
    if (!result) return
    dispatch(setAllPageLoading(true));
    window.location.href = '/' + getLobbyPage();
  }, [result]);

  return (
    <button
      onClick={() =>
        useGoogleLogin({
          onSuccess: async (response: any) => {
            const accessToken = response.access_token;
            const serv = new MemberService();
            const email = await serv.getGoogleUserEmail(accessToken);
            if (!email) return;
            const isSuccess: boolean = await serv.signUp(email, '', Account.GOOGLE);
            setResult(isSuccess);
          },
          onError: () => console.log('Sign up Failed'),
        })
      }
      className="w-full h-[40px] flex items-center justify-center border border-gray-300 rounded bg-white text-sm font-medium shadow hover:shadow-md">
      <Image
        src="/images/logo/g-logo.png"
        alt="g-logo"
        width={20}
        height={20}
      />
      <span className="font-roboto font-medium ms-[10px]">Sign up with google</span>
    </button>
  );
}

