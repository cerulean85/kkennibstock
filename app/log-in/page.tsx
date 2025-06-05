'use client'
import React from 'react';
import { useState } from "react";
import { useRouter  } from 'next/navigation';
import Image from 'next/image';
import { useLocale } from '@/layouts/LocaleContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Loading from '@/components/Loading';
import GoogleLoginButton from '@/components/GoogleLoginButton';
import EmailLoginButton from '@/components/EmailLoginButton';
import SignInForm from '@/components/SignInForm';
import FindPasswordForm from '@/components/FindPasswordForm';

const LoginPage = () => {
  
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const moveSignUp = async (e: any) => {
    e.preventDefault();
    router.push("/sign-up"); 
  };

  const [loginType, setLoginType] = useState('');

  return loading ? (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loading />
    </div>
    ) : (
    <div className="min-h-screen">
      <div className="h-[30px]">
        { 
          loginType !== "" && (        
            <div 
              onClick={() => {
                if (loginType === "email") setLoginType("");
                if (loginType === "pwd") setLoginType("email");
              }}
              className="flex items-center pt-2 ps-2 cursor-pointer">
              <Image width={26} height={26} src="/images/icon/login-back-arrow.svg" alt="back" />
              <div className="font-medium ms-1">Back</div>        
            </div>
          )
        }
      </div>

      <div className='mt-8'>
        <div className='flex justify-center items-center'>
          <Image width={220} height={100} className="logo" src="/images/logo/corp_logo_with_name.svg" alt="Logo" />
        </div>

        <div className="flex justify-center text-2xl mt-20">
          {loginType == '' && "Log in"}
          {loginType == "pwd" && "Recover your password"}
          
        </div>

        <div className="flex justify-center mt-5 w-full">
          <div className="w-full p-6">
            {
              loginType == "" &&
              <div>
                <div className='mb-2'>
                  <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ''}>
                    <GoogleLoginButton name="Sign in with google" actionType="login"/>  
                  </GoogleOAuthProvider>
                </div>
                <div>
                  <EmailLoginButton 
                    name="Sign in with eamil"
                    handler={() => setLoginType("email")} />
                </div>            
              </div>
            }
            {loginType == "email" && <SignInForm></SignInForm>}            
            {loginType == "pwd" && <FindPasswordForm></FindPasswordForm>}
            {
              loginType !== "pwd" &&
              <div className='flex items-center mt-14 p-1'>
                <div className='text-[0.8rem]'>Don’t you have an account?</div>
                <button className="btn-link text-[0.9rem] ms-2" onClick={moveSignUp}>Sign up</button>                
              </div>
            }

            {
              loginType == "email" &&              
              <div className='flex items-center mt-2 p-1'>
                <div className='text-[0.8rem]'>Forgot your password?</div>                
                <button className="btn-link text-[0.9rem] ms-2" onClick={() => setLoginType("pwd")}>Find you password</button>
              </div>              
            }
          </div>
        </div>
      </div>      
    </div>    
  );
}

export default LoginPage;