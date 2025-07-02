import { MemberService } from "@/services/MemberService";
import { useEffect, useState } from "react";
import Image from "next/image";
import { setAllPageLoading } from "@/stores/appConfigSlice";
import { UseDispatch } from "@/stores/store";
import { Account, emailRegex, getLobbyPage, nameRegex, Page, passwordRegex } from "@/lib/contant";

export default function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [validName, setValidName] = useState(true);
  const [name, setName] = useState("");

  const validate = () => {
    const isValidName = nameRegex.test(name);
    if (!isValidName) {
      alert("Please enter your name. Please use at least 5 characters.");
      return false;
    }

    const isValidEmail = emailRegex.test(email);
    if (!isValidEmail) {
      alert("Please enter a valid email address.");
      return false;
    }

    const isValidPassword = passwordRegex.test(password);
    if (!isValidPassword) {
      alert("Please enter a valid password.");
      return false;
    }

    return true;
  };

  const dispatch = UseDispatch();
  const sign = async () => {
    const authorized: boolean = validate();
    if (authorized) {
      const serv = new MemberService();
      const isSuccess: boolean = await serv.signUp(email, password, Account.EMAIL, name);
      if (isSuccess) {
        dispatch(setAllPageLoading(true));
        window.location.href = "/" + Page.LogIn;
      }
    }
  };

  const handleKeyDown = async (e: any) => {
    if (e.key === "Enter") {
      sign();
    }
  };

  useEffect(() => {
    const isValidEmail = emailRegex.test(email);
    setValidEmail(isValidEmail);
  }, [email]);

  useEffect(() => {
    const isValidName = nameRegex.test(name);
    setValidName(isValidName);
  }, [name]);

  return (
    <div>
      <input
        className="w-full"
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Enter your name"
        required
      />

      {name.length > 0 && !validName && (
        <div className="flex items-center px-2 pt-2">
          <div>
            <Image src="/images/icon/warning-small.png" width={16} height={16} alt="warning-small" />
          </div>
          <div className="text-xs ms-2 text-[#E1594C]">
            Please enter your name (e.g., John Doe) using at least 5 characters.
          </div>
        </div>
      )}

      <input
        className="w-full mt-2"
        type="text"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Enter your email"
        onKeyDown={handleKeyDown} // 엔터 키 이벤트 추가
        required
      />

      {email.length > 0 && !validEmail && (
        <div className="flex items-center px-2 pt-2">
          <div>
            <Image src="/images/icon/warning-small.png" width={16} height={16} alt="warning-small" />
          </div>
          <div className="text-xs ms-2 text-[#E1594C]">
            Please enter your email address using the format name@example.com
          </div>
        </div>
      )}

      <input
        className="w-full mt-2"
        type="password"
        value={password}
        placeholder="Enter your password"
        onKeyDown={handleKeyDown} // 엔터 키 이벤트 추가
        onChange={e => setPassword(e.target.value)}
        required
      />

      {0 < password.length && password.length < 8 && (
        <div className="mt-2 mb-4">
          <div className="flex gap-1">
            <div className="w-1/3 h-[3px] bg-[#fb5252]"></div>
            <div className="w-1/3 h-[3px] bg-[#f1f1f1]"></div>
            <div className="w-1/3 h-[3px] bg-[#f1f1f1]"></div>
          </div>
          <div className="text-sm text-[#fb5252] mt-1 font-medium">Weak</div>
          <div className="text-xs ms-2">This password is easy to guess. Please use at least 8 characters.</div>
        </div>
      )}

      {8 <= password.length && password.length < 12 && (
        <div className="mt-2 mb-4">
          <div className="flex gap-1">
            <div className="w-1/3 h-[3px] bg-[#fca120]"></div>
            <div className="w-1/3 h-[3px] bg-[#fca120]"></div>
            <div className="w-1/3 h-[3px] bg-[#f1f1f1]"></div>
          </div>
          <div className="text-sm text-[#fca120] mt-1 font-medium">Fair</div>
          <div className="text-xs">Ready to use but still guessable. Please use over 12 characters.</div>
        </div>
      )}

      {12 <= password.length && (
        <div className="mt-2 mb-4">
          <div className="flex gap-1">
            <div className="w-1/3 h-[3px] bg-[#286d34]"></div>
            <div className="w-1/3 h-[3px] bg-[#286d34]"></div>
            <div className="w-1/3 h-[3px] bg-[#286d34]"></div>
          </div>
          <div className="text-sm text-[#286d34] mt-1 font-medium">Strong</div>
          <div className="text-xs ms-2">Your password is excellent. You are good to go!</div>
        </div>
      )}

      <div className="mt-2">
        <button className="btn-main w-full h-[38px] font-bold text-[1.0rem] tracking-wider" onClick={sign}>
          Sign up
        </button>
      </div>
    </div>
  );
}
