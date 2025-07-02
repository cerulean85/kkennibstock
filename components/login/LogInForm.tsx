import { MemberService } from "@/services/MemberService";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Account, emailRegex, getLobbyPage, Page, passwordRegex } from "@/lib/contant";

export default function LogInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [validPassword, setValidPassword] = useState(false);

  const validate = () => {
    if (!validEmail) {
      alert("Please enter a valid email address.");
      return false;
    }

    if (!validPassword) {
      alert("Please enter a valid password.");
      return false;
    }

    return true;
  };

  const login = async () => {
    const authorized: boolean = validate();
    if (authorized) {
      const result: boolean = await new MemberService().logIn(email, password, Account.EMAIL);
      if (result) {
        window.location.href = "/" + getLobbyPage();
      }
    }
  };

  const handleKeyDown = async (e: any) => {
    if (e.key === "Enter") {
      login();
    }
  };

  useEffect(() => {
    const isValidEmail = emailRegex.test(email);
    setValidEmail(isValidEmail);
  }, [email]);

  useEffect(() => {
    const isValidPassword = passwordRegex.test(password);
    setValidPassword(isValidPassword);
  }, [password]);

  return (
    <div>
      <input
        className="w-full"
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

      {0 < password.length && password.length < 6 && (
        <div className="flex items-center px-2 pt-2">
          <div>
            <Image src="/images/icon/warning-small.png" width={16} height={16} alt="warning-small" />
          </div>
          <div className="text-xs ms-2 text-[#E1594C]">Please enter a password with at least 6 characters.</div>
        </div>
      )}

      <div className="mt-2">
        <button className="btn-main w-full h-[38px] font-bold text-[1.0rem] tracking-wider" onClick={login}>
          Log In
        </button>
      </div>
    </div>
  );
}
