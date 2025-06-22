import Image from "next/image";
import { useGoogleLogin } from '@react-oauth/google';
import { MemberService } from "@/services/MemberService";
import { setAllPageLoading } from "@/stores/appConfigSlice";
import { UseDispatch } from "@/stores/store";
import { useEffect, useState } from "react";
import { Account, Page } from "@/lib/contant";

export default function GoogleSignUpButton() {
  const dispatch = UseDispatch();
  const [result, setResult] = useState(false);

  const signup = useGoogleLogin({
    onSuccess: async (response: any) => {
      const accessToken = response.access_token;
      const serv = new MemberService();
      const result = await serv.getGoogleUserEmail(accessToken);
      if (!result) return;
      const isSuccess: boolean = await serv.signUp(result.email, '', Account.GOOGLE, result.name, result.picture);
      setResult(isSuccess);
    },
    onError: () => console.log('Sign up Failed'),
  })

  useEffect(() => {
    if (!result) return
    dispatch(setAllPageLoading(true));
    window.location.href = '/' + Page.LogIn;
  }, [result]);

  return (
    <button
      onClick={() => signup()}
      className="w-full h-[40px] flex items-center justify-center border border-gray-300 rounded bg-white text-sm font-medium shadow hover:shadow-md">
      <Image
        src="/images/symbol/google.png"
        alt="g-logo"
        width={20}
        height={20}
      />
      <span className="font-roboto font-medium ms-[10px]">Sign up with google</span>
    </button>
  );
}

