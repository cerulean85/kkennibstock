import Image from "next/image";
import { useGoogleLogin } from '@react-oauth/google';
import { MemberService } from "@/services/MemberService";
import { useRouter } from 'next/navigation';
import { useLocale } from "@/layouts/LocaleContext";
import { setAllPageLoading } from "@/stores/appConfigSlice";
import { UseDispatch } from "@/stores/store";
import { useEffect, useState } from "react";
import { Account, getLobbyPage, Page } from "@/lib/regacy";

export default function GoogleLogInButton() {
	const dispatch = UseDispatch();
	const [result, setResult] = useState(false);
	const loginGoogle = async (email: string) => {

	}
	useEffect(() => {
		if (!result) return
		dispatch(setAllPageLoading(true));
		window.location.href = '/' + getLobbyPage();
	}, [result])

	return (
		<button
			onClick={() =>
				useGoogleLogin({
					onSuccess: async (response: any) => {
						const accessToken = response.access_token;
						const serv = new MemberService();
						const email = await serv.getGoogleUserEmail(accessToken);
						if (!email) return;
						const isSuccess: boolean = await serv.logIn(email, '', Account.GOOGLE);
						setResult(isSuccess);
					},
					onError: () => console.log('Log in Failed'),
				})
			}
			className="w-full h-[40px] flex items-center justify-center border border-gray-300 rounded bg-white text-sm font-medium shadow hover:shadow-md">
			<Image
				src="/images/logo/g-logo.png"
				alt="g-logo"
				width={20}
				height={20}
			/>
			<span className="font-roboto font-medium ms-[10px]">Log in with google</span>
		</button>
	);
}

