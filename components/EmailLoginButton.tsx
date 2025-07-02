import Image from "next/image";
import { GoogleOAuthProvider, GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import { fetchPostWithCookie } from "@/repositories/req";

const loginGoogle = async (credential: string) => {
  const result = await fetchPostWithCookie("api/auth/google", credential);
  console.log("loginGoogle Result");
  console.log(result);
};

export default function EmailLoginButton({ name, handler: method }: { name: string; handler: () => void }) {
  return (
    <button
      onClick={method}
      className="w-full h-[40px] flex items-center justify-center border border-gray-300 rounded bg-white text-sm font-medium shadow hover:shadow-md"
    >
      <Image src="/images/icon/email.svg" alt="email-logo" width={20} height={20} />
      <span className="font-roboto font-medium ms-[10px]">{name}</span>
    </button>
  );
}
