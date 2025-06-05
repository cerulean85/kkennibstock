import { MemberService } from "@/services/MemberService";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function FindPasswordForm() {

	const [email, setEmail] = useState("");
	const [validEmail, setValidEmail] = useState(false);

	const validate = () => {
		if (!validEmail) {
			alert("Please enter a valid email address.");
  		return false;
		}

		return true;		
	}

	const sendResetLink = () => {
		const authorized: boolean = validate();
		if (authorized) {
			// onSign(email, password);
		}
	}

	const handleKeyDown = async (e: any) => {
		if (e.key === "Enter") {
			sendResetLink();
		}
  };
	

	useEffect(() => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const isValidEmail = emailRegex.test(email);
		setValidEmail(isValidEmail);
	}, [email])

	return (
		<div>

			<div>
				<div className="mt-2 mb-10 text-sm">Enter the email that you used when you signed up to recover your password. You will receive a password reset link.</div>
			</div>

			<input
				className="w-full"
				type="text"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				placeholder="Enter your email"
				onKeyDown={handleKeyDown} // 엔터 키 이벤트 추가
				required
			/>

			{
				(email.length > 0 && !validEmail) && 
				<div className="flex items-center px-2 pt-2">
					<div>
						<Image src="/images/icon/warning-small.png" width={16} height={16} alt="warning-small" />
					</div>
					<div className="text-xs ms-2 text-[#E1594C]">Please enter your email address using the format name@example.com</div>
				</div>
			}

			<div className="mt-2">
				<button className="btn-main w-full h-[38px] font-bold text-[1.0rem] tracking-wider" onClick={sendResetLink}>Send Link</button>
			</div>
		</div>
	)
}