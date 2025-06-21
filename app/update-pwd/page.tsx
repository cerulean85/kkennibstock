'use client'
import React, { useEffect } from 'react';
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MemberService } from '@/services/MemberService';
import Image from 'next/image';
import Loading from '@/components/Loading';
import { Account, Page } from '@/lib/contant';
import UpdatePasswordForm from '@/components/login/UpdatePasswordForm';



const UpdatePasswordPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState<string>('');

  useEffect(() => {
    const paramToken = searchParams.get("token");
    if (!paramToken) {
      router.replace("/404");
      return;
    }
    (new MemberService()).checkResetToken(paramToken)
      .then((isValid: boolean) => {
        if (!isValid) {
          alert("Invalid or expired token.");
          router.replace("/404");
        }
        setToken(paramToken);
      })
      .catch((error: any) => {
        console.error("Error checking reset token:", error);
        alert("Invalid or expired token.");
        router.replace("/404");
      });
  }, [router, searchParams]);

  const [loading, setLoading] = useState(false);

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
          Update password
        </div>

        <div className="flex justify-center mt-5 w-full">
          <div className="w-full p-6">
          
            <UpdatePasswordForm token={token}></UpdatePasswordForm>

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