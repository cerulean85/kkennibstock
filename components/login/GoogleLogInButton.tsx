import Image from "next/image";
import { useGoogleLogin } from '@react-oauth/google';
import { MemberService } from "@/services/MemberService";
import { setAllPageLoading } from "@/stores/appConfigSlice";
import { UseDispatch } from "@/stores/store";
import { useEffect, useState } from "react";
import { Account, getLobbyPage } from "@/lib/contant";

export default function GoogleLogInButton() {
	const dispatch = UseDispatch();
	const [result, setResult] = useState(false);

	const login = useGoogleLogin({
		onSuccess: async (response: any) => {
			console.log('Google login response:');
			const accessToken = response.access_token;

			// 사용자 정보 요청
			const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
				headers: { Authorization: `Bearer ${accessToken}` },
			});
			const userInfo = await userInfoRes.json();
			const email = userInfo.email;
			const profileImage = userInfo.picture; // 프로필 사진 URL

			if (!email) return;
			const serv = new MemberService();
			const isSuccess: boolean = await serv.logIn(email, '', Account.GOOGLE);
			setResult(isSuccess);

			// 프로필 사진 활용 예시
			console.log("프로필 사진 URL:", profileImage);
			// setProfileImage(profileImage); // 필요시 상태로 저장
		},
		onError: () => console.log('Log in Failed'),
	});

	useEffect(() => {
		if (!result) return
		dispatch(setAllPageLoading(true));
		window.location.href = '/' + getLobbyPage();
	}, [result])

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
			<span className="font-roboto font-medium ms-[10px]">Log in with google</span>
		</button>
	);
}

