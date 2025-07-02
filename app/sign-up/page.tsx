"use client";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { GoogleOAuthProvider } from "@react-oauth/google";
import EmailLoginButton from "@/components/EmailLoginButton";
import SignUpForm from "@/components/login/SignUpForm";
import { Page } from "@/lib/contant";
import { Account } from "@/lib/contant";
import GoogleSignUpButton from "@/components/login/GoogleSignUpButton";

const SignInPage = () => {
  const router = useRouter();
  const [accountType, setAccountType] = useState<Account | null>(null);
  const moveLogin = async (e: any) => {
    e.preventDefault();
    router.push("/" + Page.LogIn);
  };

  return (
    <div className="min-h-screen">
      <div className="h-[30px]">
        {accountType == Account.EMAIL && (
          <div onClick={() => setAccountType(null)} className="flex items-center pt-2 ps-2 cursor-pointer">
            <Image width={26} height={26} src="/images/icon/login-back-arrow.svg" alt="back" />
            <div className="font-medium ms-1">Back</div>
          </div>
        )}
      </div>

      <div className="mt-8">
        <div className="flex justify-center items-center">
          <Image width={220} height={100} className="logo" src="/images/symbol/corp_logo_with_name.svg" alt="Logo" />
        </div>
        <div className="flex justify-center text-2xl mt-20">Create an account</div>

        <div className="flex justify-center mt-5 w-full">
          <div className="w-full p-6">
            {!accountType && (
              <div>
                <div className="mb-2">
                  <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ""}>
                    <GoogleSignUpButton></GoogleSignUpButton>
                  </GoogleOAuthProvider>
                </div>
                <div>
                  <EmailLoginButton name="Sign up with eamil" handler={() => setAccountType(Account.EMAIL)} />
                </div>
              </div>
            )}

            {accountType == Account.EMAIL && <SignUpForm></SignUpForm>}

            <div className="flex items-center mt-14 p-1">
              <div className="text-[0.8rem]">Already have an account?</div>
              <button className="btn-link text-[0.9rem] ms-2" onClick={moveLogin}>
                Log in
              </button>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
