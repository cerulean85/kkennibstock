import Image from "next/image";
import { useGoogleLogin  } from '@react-oauth/google';
import { MemberService } from "@/services/MemberService";
import { useRouter } from 'next/navigation';
import { useLocale } from "@/layouts/LocaleContext";
import { setAllPageLoading } from "@/stores/appConfigSlice";
import { UseDispatch } from "@/stores/store";
import { useEffect, useState } from "react";

export default function GoogleLoginButton({
	name,
	actionType
}:{
	name: string,
	actionType: string
}) {


	const registGoogle = async (email: string) => {
		if (!email) return;
		const serv = new MemberService();
		const isSuccess: boolean = await serv.signUp(email, '', "GOOGLE");
		if (isSuccess) {
			alert("Your registration was successful.")
		}
	}

	const router = useRouter();
	const locale = useLocale();  
	const dispatch = UseDispatch();
	const [loginResult, setLoginResult] = useState(false);
	const loginGoogle = async (email: string) => {
		if (!email) return false;
		const serv = new MemberService();
		const isSuccess: boolean = await serv.signIn(email, '', "GOOGLE");
		if (!isSuccess) {
			alert("Login failed.");
			return false;
		}
		return true;
	}

    const login = useGoogleLogin({
      onSuccess: async (response: any) => {
			
			const accessToken = response.access_token;
			const serv = new MemberService();
      const email = await serv.getGoogleUserEmail(accessToken);

			if (actionType === "join") {
				registGoogle(email);
			} else {
				const isSuccess: boolean = await loginGoogle(email);
				setLoginResult(isSuccess);
			}
      },
      onError: () => console.log('Login Failed'),
    });

		useEffect(() => {
			if(!loginResult) return
			dispatch(setAllPageLoading(true));
			window.location.href = `/${locale}/metrics`;
		}, [loginResult])

    return (
      <button
        onClick={() => login()}
        className="w-full h-[40px] flex items-center justify-center border border-gray-300 rounded bg-white text-sm font-medium shadow hover:shadow-md">        
        <Image
          src="/images/logo/g-logo.png"
          alt="g-logo"          
          width={20}
          height={20}
        />
        <span className="font-roboto font-medium ms-[10px]">{name}</span>
      </button>
    );
  }

