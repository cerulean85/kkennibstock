'use client'
import React from 'react';
import { useState } from "react";
import { useRouter  } from 'next/navigation';
import { MemberService } from '@/services/MemberService';
import Image from 'next/image';
import { useLocale } from '@/layouts/LocaleContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Loading from '@/components/Loading';
import GoogleLoginButton from '@/components/GoogleLoginButton';
import EmailLoginButton from '@/components/EmailLoginButton';
import SignUpForm from '@/components/SignUpForm';


const SignInPage = () => {
  
  const locale = useLocale();  
  const [t, setT] = useState<any>();

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [selectedLocale, setSelectedLocale] = useState(locale);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const loginUser = async (email: string, password: string) => {
    alert("Success!!")
    // e.preventDefault();

    // const serv = new MemberService();
    // const result: any = await serv.signIn(userId, password);
    // if (result) {
    //   setLoading(true);
    //   const isAdmin = localStorage.getItem("isAdmin") === 'Y';
    //   router.push(`/${locale}/${isAdmin ? 'adm/user_list' : 'ops/stat_fwh'}`); 
    // } else {
    //   alert("입력하신 아이디 또는 비밀번호를 확인해주세요.");
    // }
  };

  const [joinType, setJoinType] = useState('');
  const moveSignin = async (e: any) => {
    e.preventDefault();
    router.push(`/${locale}/signin`); 
  };

  return loading ? (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loading />
      </div>
      ) : (
    <div className="min-h-screen">


      <div className="h-[30px]">
      { 
        joinType === "email" && (        
          <div 
            onClick={() => setJoinType("")}
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
        <div className="flex justify-center mt-10 w-full">
          <div className="w-full p-6">
          {
            joinType == "" &&
            <div>
              <div className='mb-2'>
                <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ''}>
                  <GoogleLoginButton name="Sign up with google" actionType="join"/>  
                </GoogleOAuthProvider>
              </div>
              <div>
                <EmailLoginButton 
                  name="Sign up with eamil"
                  handler={() => setJoinType("email")} />
              </div>
            </div>
          }
          
          {
            joinType == "email" &&
            <SignUpForm></SignUpForm>
          }

                <div className='flex items-center mt-14 p-1'>
                  <div className='text-[0.8rem]'>Already have an account?</div>
                  <button className="btn-link text-[0.9rem] ms-2" onClick={moveSignin}>Sign in</button>
                </div>
              <div>         
            </div>
          </div>
        </div>
      </div>      
    </div>    
  );
}

export default SignInPage;