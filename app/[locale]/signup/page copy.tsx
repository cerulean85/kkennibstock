// 'use client'
// import React, { useEffect } from 'react';
// import { useState } from "react";
// import { UserService } from '@/services/UserService';
// import { useRouter  } from 'next/navigation';
// import { getMessages } from '@/lib/domain';
// import { useLocale } from '@/layouts/LocaleContext';
// import Image from 'next/image';
// import styled from 'styled-components';

// // 스타일드 컴포넌트 정의
// const LbHeaderX = styled.div`
//   padding-left: 0.5rem;
//   margin-top: 0.75rem;
//   margin-bottom: 0.25rem;
//   font-weight: bold;
//   font-size: 1rem;
//   color: #333;
// `;

// const SignUpPage = () => {
    
//   const locale = useLocale();  
//   // alert(locale)
//   const [t, setT] = useState<any>();

  
//   const fetchMessage = async () => {
//     const message = await getMessages(locale);
//     setT(message.signup)
//   }

//   useEffect(() => {

//     if (!locale) {
//       console.error("Locale is not defined");
//       return;
//     }

//     fetchMessage();
//   }, [locale])

//   const router = useRouter();
//   const signupUser = async (e: any) => {
//     e.preventDefault();

//     if (!isValidRegUserId) {
//       alert(t.idRequired);
//       return;
//     }

//     if (!hasBeenRequestedDuplicatedIdCheck) {
//       alert(t.idDuplicateCheckRequired);
//       return;
//     }

//     if(isDuplicatedId) {
//       alert(t.idDuplicate);
//     }

//     if (!isValidRegPassword) {
//       alert(t.passwordRequired);
//       return;
//     }
//     if (!isValidRegRepassword) {
//       alert(t.passwordRequired);
//       return;
//     }

//     if (!isValidRegName) {
//       alert(t.nameInput);
//       return;
//     }
//     if (!isValidRegOrg) {
//       alert(t.departmentRequired);
//       return;
//     }
//     if (!isValidRegMail) {
//       alert(t.emailRequired);
//       return;
//     }
//     if (!isValidRegPhone) {
//       alert(t.phoneRequired);
//       return;
//     }

//     if(confirm(t.accountCreationConfirm)) {
//       const serv = new UserService();      
//       const result: boolean = await serv.signUp(userId, password, mail, name, org, phone);
//       if (result) {
//         router.push(`/${locale}/login`); 
//       }
//     }     
//   };

//   const [isValidRegUserId, setIsValidRegUserId] = useState(false);
//   const [isDuplicatedId, setIsDuplicatedId] = useState(false);
//   const [hasBeenInteractedUserId, setHasBeenInteractedUserId] = useState(false);
//   const [hasBeenRequestedDuplicatedIdCheck, setHasBeenRequestedDuplicatedIdCheck] = useState(false);
//   const [userId, setUserId] = useState('');  
//   const checkUserId = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setHasBeenInteractedUserId(true);
//     setHasBeenRequestedDuplicatedIdCheck(false);
//     setIsDuplicatedId(false);
    
//     const value = e.target.value;    
//     setUserId(value);

//     const regex = /^[a-zA-Z][a-zA-Z0-9]{3,15}$/;
//     const isValid = regex.test(value);
//     setIsValidRegUserId(isValid);    
//   };

//   const checkDuplicatedId = async () => {

//     if (!isValidRegUserId) {
//       alert('아이디 형식이 맞지 않습니다');
//       return;
//     }
    
//     const serv = new UserService();
//     const isDuplicated = await serv.checkDuplicedUserId(userId)
//     setIsDuplicatedId(isDuplicated);
//     setHasBeenRequestedDuplicatedIdCheck(true);
//   }

//   const [hasBeenInteractedPassword, setHasBeenInteractedPassword] = useState(false);
//   const [isValidRegPassword, setIsValidRegPassword] = useState(false);
//   const [password, setPassword] = useState("");
//   const checkPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setHasBeenInteractedPassword(true);

//     const value = e.target.value;    
//     setPassword(value);

//     const regex = /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[a-z\d!@#$%^&*]{8,}$/;
//     const isValid = regex.test(value);
//     setIsValidRegPassword(isValid);    
//   }

//   const [isValidRegRepassword, setIsValidRegRepassword] = useState(false);
//   const checkRepassword = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     setIsValidRegRepassword(password === value);
//   }

//   const [hasBeenInteractedOrg, setHasBeenInteractedOrg] = useState(false);
//   const [isValidRegOrg, setIsValidRegOrg] = useState(false);
//   const [org, setOrg] = useState("");
//   const checkOrg = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setHasBeenInteractedOrg(true);

//     const value = e.target.value;    
//     setOrg(value);

//     const regex = /^[a-zA-Z가-힣0-9&·\-\_() ]{2,30}$/;
//     const isValid = regex.test(value);
//     setIsValidRegOrg(isValid);    
//   }

//   const [hasBeenInteractedName, setHasBeenInteractedName] = useState(false);
//   const [isValidRegName, setIsValidRegName] = useState(false);
//   const [name, setName] = useState("");
//   const checkName = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setHasBeenInteractedName(true);

//     const value = e.target.value;    
//     setName(value);

//     const regex = /^[a-zA-Z가-힣]{2,20}$/;
//     const isValid = regex.test(value);
//     setIsValidRegName(isValid);    
//   }

//   const [hasBeenInteractedPhone, setHasBeenInteractedPhone] = useState(false);
//   const [isValidRegPhone, setIsValidRegPhone] = useState(false);
//   const [phone, setPhone] = useState("");
//   const checkPhone = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setHasBeenInteractedPhone(true);

//     const value = e.target.value;    
//     setPhone(value);

//     const regex = /^(01[0-9])\d{3,4}\d{4}$/;
//     const isValid = regex.test(value);
//     setIsValidRegPhone(isValid);    
//   }

//   const [hasBeenInteractedMail, setHasBeenInteractedMail] = useState(false);
//   const [isValidRegMail, setIsValidRegMail] = useState(false);
//   const [mail, setMail] = useState("");
//   const checkMail = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setHasBeenInteractedMail(true);

//     const value = e.target.value;    
//     setMail(value);

//     const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//     const isValid = regex.test(value);
//     setIsValidRegMail(isValid);    
//   }

//   const moveLogin = async (e: any) => {
//     e.preventDefault();
//     router.push(`/${locale}/login`); 
//   };
//   if (!t) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="min-h-screen mt-[15%] ">
//       <div className='mt-14 flex-1'>
//         <div className='flex justify-center items-center'>
//           <Image width={220} height={100} className="logo" src="/images/logo/corp_logo_with_name.svg" alt="Logo" />
//         </div>
//         <div className="flex justify-center mt-4 ">
//           <div className="bg-white px-5 py-6"> 
//             <LbHeaderX>* ID</LbHeaderX>
//             <div className='w-full flex'>            
//               <div>
//                 <input
//                   type="text"
//                   onKeyDown={(e) => {
//                     if (e.key === 'Enter') {
//                       checkDuplicatedId();
//                     }
//                   }}
//                   onChange={checkUserId}
//                   placeholder={t.idInput}
//                 />
//               </div>
//               <button
//                 className="btn-sub ms-2 w-[100px]"
//                 onClick={checkDuplicatedId}
//                 disabled={!isValidRegUserId}
//                 >{t.idCheck}</button>
//             </div>

//             { (!isValidRegUserId) && (userId.length > 0) && (
//               <div className='flex ms-3 mt-2 mb-2 check-input-error'>            
//                   {t.idInvalidFormat}<br/>
//                   &nbsp;&nbsp;- {t.idFormatGuide}<br/>
//                   &nbsp;&nbsp;- {t.idFirstCharInvalid}
//               </div>
//             )}

//             { (hasBeenInteractedUserId && (userId.length === 0 || userId === '') ) && (
//               <div className='flex ms-3 mt-2 mb-2 check-input-error'>            
//                 {t.idInput}
//               </div>
//             )}
            
//             { (hasBeenRequestedDuplicatedIdCheck && isDuplicatedId) && (
//               <div className='flex ms-3 mt-2 mb-2 check-input-error'>            
//                   {t.idInUse}
//               </div>
//             )}

//             { (!hasBeenRequestedDuplicatedIdCheck && isValidRegUserId) && (userId.length > 0) && (
//               <div className='flex ms-3 mt-2 mb-2 check-input-error'>            
//                   {t.idDuplicateCheckRequired}
//               </div>
//             )}

//             { (hasBeenRequestedDuplicatedIdCheck && !isDuplicatedId) && (
//               <div className='flex ms-3 mt-2 mb-2 check-input-error'>            
//                   {t.idAvailable}
//               </div>
//             )}

//             <LbHeaderX>* {t.passwordLabel}</LbHeaderX>
//             <div className='flex'>            
//               <input
//                 className="w-full"
//                 type="password"                
//                 onChange={checkPassword}
//                 placeholder={t.passwordInput}
//               />       
//             </div>

//             { (hasBeenInteractedPassword && (password.length === 0 || password === '') ) && (
//               <div className='flex ms-3 mt-2 mb-2 check-input-error'>            
//                 {t.passwordInput}
//               </div>
//             )}

//             { (!isValidRegPassword) && (password.length > 0) && (
//               <div className='flex ms-3 mt-2 mb-2 check-input-error'>            
//               {t.passwordInvalidFormat}<br/>
//                 &nbsp;&nbsp;- {t.passwordFormatGuide1}<br/>
//                 &nbsp;&nbsp;- {t.passwordFormatGuide2}              
//               </div>
//             )}

//             <LbHeaderX>* {t.passwordConfirmLabel}</LbHeaderX>
//             <div className='flex'>            
//               <input
//                 className="w-full"
//                 type="password"
//                 onChange={checkRepassword}
//                 placeholder={t.passwordConfirmInput}
//               />       
//             </div>

//             { (!isValidRegRepassword) && (password.length > 0) && (
//               <div className='flex ms-3 mt-2 mb-2 check-input-error'>            
//                 {t.passwordMismatch}
//               </div>
//             )}

//             <LbHeaderX>* {t.nameLabel}</LbHeaderX>
//             <div className='flex'>            
//               <input
//                 className="w-full"
//                 type="text"
//                 onChange={checkName}
//                 placeholder={t.nameInput}
//               />
//             </div>

//             { (hasBeenInteractedName && (name.length === 0 || name === '') ) && (
//               <div className='d-flex ms-3 mt-2 mb-2 check-input-error'>            
//                 {t.nameInput}
//               </div>
//             )}

//             { (!isValidRegName) && (name.length > 0) && (
//               <div className='d-flex ms-3 mt-2 mb-2 check-input-error'>            
//                 {t.nameInvalidFormat}<br/>
//                 - {t.nameFormatGuide}
//               </div>
//             )}

//             <LbHeaderX>* {t.departmentLabel}</LbHeaderX>
//             <div className='flex'>            
//               <input
//                 className="w-full"
//                 type="text"
//                 onChange={checkOrg}
//                 placeholder={t.departmentInput}
//                 required
//               />
//             </div>

//             { (hasBeenInteractedOrg && (org.length === 0 || org === '') ) && (
//               <div className='flex ms-3 mt-2 mb-2 check-input-error'>            
//                 {t.departmentInput}
//               </div>
//             )}

//             { (!isValidRegOrg) && (org.length > 0) && (
//               <div className='flex ms-3 mt-2 mb-2 check-input-error'>            
//                 {t.departmentInvalidFormat}<br/>
//                 - {t.departmentFormatGuide}
//               </div>
//             )}

//             <LbHeaderX>* {t.contactLabel}</LbHeaderX>
//             <div className='flex'>                          
//               <input
//                 className="w-full"
//                 type="text"
//                 onChange={checkPhone}
//                 placeholder={t.contactInput}
//                 required
//               />
//             </div>

//             { (hasBeenInteractedPhone && (phone.length === 0 || phone === '') ) && (
//               <div className='flex ms-3 mt-2 mb-2 check-input-error'>            
//                 {t.contactInput}
//               </div>
//             )}

//             { (!isValidRegPhone) && (phone.length > 0) && (
//               <div className='flex ms-3 mt-2 mb-2 check-input-error'>            
//                 {t.contactInvalidFormat}
//               </div>
//             )}

//             <LbHeaderX>* {t.emailLabel}</LbHeaderX>
//             <div className='flex'>            
//               <input
//                 type="text"
//                 className="w-full"
//                 onChange={checkMail}
//                 placeholder={t.emailInput}
//                 required
//               />  
//             </div>

//             { (hasBeenInteractedMail && (mail.length === 0 || mail === '') ) && (
//               <div className='flex ms-3 mt-2 mb-2 check-input-error'>            
//                 {t.emailInput}
//               </div>
//             )}

//             { (!isValidRegMail) && (mail.length > 0) && (
//               <div className='flex ms-3 mt-2 mb-2 check-input-error'>            
//                 {t.emailInvalidFormat}
//               </div>
//             )}

//               <button className="btn-main w-full mt-4 h-[45px]" onClick={signupUser}>{t.createAccountButton}</button>

//             <div className='flex items-center mt-4 p-1'>
//               <div className='text-[0.8rem]'>Already have an account?</div>                
//               <button className="btn-link text-[0.9rem] ms-2" onClick={moveLogin}>Log in</button>
//             </div>    
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SignUpPage;