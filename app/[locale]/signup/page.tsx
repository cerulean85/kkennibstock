'use client'
import React from 'react';
import { useState } from "react";
import { useRouter  } from 'next/navigation';
import { UserService } from '@/services/UserService';
import Image from 'next/image';
import { useLocale } from '@/layouts/LocaleContext';
import { GoogleOAuthProvider, GoogleLogin, useGoogleLogin  } from '@react-oauth/google';
import { fetchPostWithCookie, fetchHappGet, fetchHappPost } from '@/repositories/req'
import Loading from '@/components/Loading';


const SignInPage = () => {
  
  const locale = useLocale();  
  const [t, setT] = useState<any>();

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [selectedLocale, setSelectedLocale] = useState(locale);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const loginUser = async (e: any) => {
    e.preventDefault();

    const serv = new UserService();
    const result: any = await serv.login(userId, password);
    if (result) {
      setLoading(true);
      const isAdmin = localStorage.getItem("isAdmin") === 'Y';
      router.push(`/${locale}/${isAdmin ? 'adm/user_list' : 'ops/stat_fwh'}`); 
    } else {
      alert("입력하신 아이디 또는 비밀번호를 확인해주세요.");
    }
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      loginUser(e);
    }
  };

  const loginGoogle = async (credential: string) => {
    const result = await fetchPostWithCookie("api/auth/google", credential)
    console.log("loginGoogle Result");
    console.log(result);
  }

  const [joinType, setJoinType] = useState('');
  const moveLogin = async (e: any) => {
    e.preventDefault();
    router.push(`/${locale}/login`); 
  };

  function CustomGoogleLoginButton() {
    const login = useGoogleLogin({
      onSuccess: (response: any) => {
        if (!response || !response.credential)
          return;
        console.log(response.credential)
        loginGoogle(response.credential ?? '');

      },
      onError: () => console.log('Login Failed'),
    });

    return (
<button
  onClick={() => login()}
  className="w-full h-[40px] flex items-center justify-center border border-gray-300 rounded bg-white text-sm font-medium shadow hover:shadow-md"
>
  
  <img

    src="https://developers.google.com/identity/images/g-logo.png"
    alt="Google"
    className="w-[20px] h-[20px]"
  />
  <span className="">Sign up with google</span>
</button>
    );
  }


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
                  <GoogleOAuthProvider 
                    clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ''}>
      <CustomGoogleLoginButton />
    
                    {/* <GoogleLogin
                      text="signup_with"
                      logo_alignment="center"                      
                      onSuccess={response => {
                        if (!response || !response.credential)
                          return;
                        console.log(response.credential)
                        loginGoogle(response.credential ?? '');

                      }}
                      onError={() => {
                        console.log('Login Failed');
                      }}
                    /> */}
                  </GoogleOAuthProvider>
                </div>
                <div>
                  <div 
                    onClick={() => setJoinType("email")}
                    className="
                      border border-[#DADCE0]
                      rounded h-[38px]
                      flex justify-center items-center
                      text-[0.9rem] text-[#1A1A1A]
                      cursor-pointer
                      hover:bg-gray-100
                      hover:border-[#b0b0b0]
                      transition">
                    <Image width={20} height={20} src="/images/icon/email.svg" alt="email" />
                    <div className="ms-2 text-[0.82rem]">Signup with eamil</div>
                  </div>
                </div>
              </div>
            }
            {
              joinType == "email" &&
              <div>
                <input
                  className="w-full mb-2"
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder='Enter your account...'
                  onKeyDown={handleKeyDown} // 엔터 키 이벤트 추가
                  required
                />
              
                <input
                  className="w-full mb-2"
                  type="password" 
                  value={password}
                  placeholder='Enter your password...'
                  onKeyDown={handleKeyDown} // 엔터 키 이벤트 추가
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                
                <div>
                  <button className="btn-main w-full h-[38px] font-bold text-[1.0rem] tracking-wider" onClick={loginUser}>Sing up</button>
                </div>
              </div>
            }

                <div className='flex items-center mt-14 p-1'>
                  <div className='text-[0.8rem]'>Already have an account?</div>
                  <button className="btn-link text-[0.9rem] ms-2" onClick={moveLogin}>Login</button>
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