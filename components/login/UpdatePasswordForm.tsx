import { MemberService } from "@/services/MemberService";
import { useEffect, useState } from "react";
import { getLobbyPage, passwordRegex } from "@/lib/contant";
import PasswordInput from "../PasswordInput";
import Image from "next/image";
import { UseDispatch } from '@/stores/store';
import { setAllPageLoading } from '@/stores/appConfigSlice';

export default function UpdatePasswordForm({
	token
}: {
	token: string;
}) {

	const [password, setPassword] = useState("");
	const [repassword, setRepassword] = useState("");
	const [validPassword, setValidPassword] = useState(false);

	const validate = () => {
		const isValidPassword = passwordRegex.test(password);
		if (!isValidPassword) {
  		alert("Please enter a valid password.");
  		return false;
		}		
		if (password !== repassword) {
			alert("The passwords you entered do not match.");
			return false;
		}
		return true;		
	}

	const dispatch = UseDispatch();
	const updatePassword = async () => {
		const authorized: boolean = validate();
		if (authorized) {
			const result: boolean = await (new MemberService()).updatePassword(token, password);
			if (result) {
				alert("Your password has been updated successfully.");
				dispatch(setAllPageLoading(true));
				window.location.href = '/' + getLobbyPage();
			} else {
				alert("Failed to update password. Please try again.");
			}
		}
	}

	const handleKeyDown = async (e: any) => {
		if (e.key === "Enter") {
			updatePassword();
		}
  };
	

	useEffect(() => {
		const isValidPassword = passwordRegex.test(password);
		setValidPassword(isValidPassword);
	}, [password])

	return (
		<div className="space-y-2">

		<PasswordInput
		  value={password}
			placeholder = "Enter new password"
  		onChange={(e: any) => setPassword(e.target.value)}
  		onKeyDown={handleKeyDown}
		/>

		{
			(0 < password.length && password.length < 8) &&
			<div className="mt-2 mb-4">
				<div className="flex gap-1">
					<div className="w-1/3 h-[3px] bg-[#fb5252]"></div>
					<div className="w-1/3 h-[3px] bg-[#f1f1f1]"></div>
					<div className="w-1/3 h-[3px] bg-[#f1f1f1]"></div>
				</div>
				<div className="text-sm text-[#fb5252] mt-1 font-medium">Weak</div>
				<div className="text-xs ms-2">This password is easy to guess. Please use at least 8 characters.</div>
			</div>	
		}			

		{
			(8 <= password.length && password.length < 12) &&
			<div className="mt-2 mb-4">
				<div className="flex gap-1">
					<div className="w-1/3 h-[3px] bg-[#fca120]"></div>
					<div className="w-1/3 h-[3px] bg-[#fca120]"></div>
					<div className="w-1/3 h-[3px] bg-[#f1f1f1]"></div>
				</div>
				<div className="text-sm text-[#fca120] mt-1 font-medium">Fair</div>
				<div className="text-xs">Ready to use but still guessable. Please use over 12 characters.</div>
			</div>		
		}

		{
			(12 <= password.length) &&
			<div className="mt-2 mb-4">
				<div className="flex gap-1">
					<div className="w-1/3 h-[3px] bg-[#286d34]"></div>
					<div className="w-1/3 h-[3px] bg-[#286d34]"></div>
					<div className="w-1/3 h-[3px] bg-[#286d34]"></div>
				</div>				
				<div className="text-sm text-[#286d34] mt-1 font-medium">Strong</div>
				<div className="text-xs ms-2">Your password is excellent. You are good to go!</div>						
			</div>		
		}

		<PasswordInput
		  value={repassword}			
			placeholder = "Re-enter your password."
  		onChange={(e: any) => setRepassword(e.target.value)}
  		onKeyDown={handleKeyDown}
		/>

		{
			(password.length > 0 && repassword.length > 0) && validPassword && (password != repassword) && 
			<div className="flex items-center px-2 pt-2">
				<div>
					<Image src="/images/icon/warning-small.png" width={16} height={16} alt="warning-small" />
				</div>
				<div className="text-xs ms-2 text-[#E1594C]">Passwords don't match. Please double-check and try again</div>
			</div>
		}

		<div className="mt-2">
			<button className="btn-main w-full h-[38px] font-bold text-[1.0rem] tracking-wider" onClick={updatePassword}>Sign up</button>
		</div>
	</div>
	)
}