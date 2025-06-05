'use client'
import React from 'react';
import { useState } from "react";
import { useRouter  } from 'next/navigation';
import { MemberService } from '@/services/MemberService';
import Image from 'next/image';
import { useLocale } from '@/layouts/LocaleContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Loading from '@/components/Loading';
import GoogleLogInButton from '@/components/google/GoogleLogInButton';
import EmailLoginButton from '@/components/EmailLoginButton';
import SignUpForm from '@/components/SignUpForm';
import { Account, Page } from '@/lib/regacy';


const UpdatePasswordPage = () => {
  
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

  const [accountType, setAccountType] = useState<Account | null>(null);
  const moveLogin = async (e: any) => {
    e.preventDefault();
    router.push('/' + Page.LogIn); 
  };

  return loading ? (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loading />
      </div>
      ) : (
    <div className="min-h-screen">
      <div className="h-[30px]">
      { 
        accountType === Account.EMAIL && (        
          <div 
            onClick={() => setAccountType(null)}
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
          Create an account
        </div>

        <div className="flex justify-center mt-5 w-full">
          <div className="w-full p-6">
          {
            !accountType &&
            <div>
              <div className='mb-2'>
                <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ''}>
                  <GoogleLogInButton name="Sign up with google" actionType="join"/>  
                </GoogleOAuthProvider>
              </div>
              <div>
                <EmailLoginButton 
                  name="Sign up with eamil"
                  handler={() => setAccountType(Account.EMAIL)} />
              </div>
            </div>
          }
          
          {
            accountType == Account.EMAIL &&
            <SignUpForm></SignUpForm>
          }

                <div className='flex items-center mt-14 p-1'>
                  <div className='text-[0.8rem]'>Already have an account?</div>
                  <button className="btn-link text-[0.9rem] ms-2" onClick={moveLogin}>Log in</button>
                </div>
              <div>         
            </div>
          </div>
        </div>
      </div>      
    </div>    
  );
}

export default UpdatePasswordPage;