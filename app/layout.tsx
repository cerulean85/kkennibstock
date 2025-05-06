"use client"
import { ReactNode, useState } from 'react';
import ProviderWrapper from '@/components/ProviderWrapper';
import "@/styles/common.scss"
import 'bootstrap/dist/css/bootstrap.min.css';
import "./globals.css";
import { useRouter } from 'next/navigation';

export default function AppLayout({ children }: { children: ReactNode; params: { locale: string } }) {

  const menuNames: any = {
    "metrics": "Metrics",      
    "info": "INFO.",
    "diary": "Diary",
    "board": "Board"
  };

  const router = useRouter();
  const movePage = (menuKey: string) => {                     
    router.push(`/${menuKey}`); 
  }

  const menuKeys = Object.keys(menuNames);
  
  // 메뉴 토글 상태 관리
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 햄버거 메뉴 토글
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <ProviderWrapper>
    <html>
      <head>
        <title>Stock DEV</title>
      </head>
      <body className="flex flex-col min-h-screen mx-auto">        
        <header className="h-[var(--header-height)] bg-[var(--bg-header-color)]">
          <div className="w-full h-full flex justify-between items-center ps-3">
            <img width={120} src="/images/icon/logo_title.svg" />
            <div className="hidden h-full md:flex items-center space-x-28">
              {
                menuKeys.map((menuKey: any, index) => (
                  <div key={index} onClick={() => movePage(menuKey)}
                      className="h-full flex items-center text-white cursor-pointer">
                    <strong>{menuNames[menuKey]}</strong>
                  </div>
                ))
              }
            </div>
            {/* 햄버거 아이콘 (모바일에서만 보이도록 설정) */}
            <div className="hidden md:block w-72 h-full"></div>
            <div className="h-full md:hidden pt-1 pe-3 cursor-pointer text-white flex justify-center items-center text-2xl" onClick={toggleMenu}>
              &#9776;
            </div>
          </div>
        </header>

        {/* 모바일 메뉴 (햄버거 메뉴가 클릭되면 표시) */}
        {isMenuOpen && (
          <div className="md:hidden bg-[var(--bg-header-color)] text-white">
            <div className="flex flex-col">
              {
                menuKeys.map((menuKey: any, index) => (
                  <div key={index} onClick={() => { movePage(menuKey); setIsMenuOpen(false); }}
                      className="p-4 cursor-pointer">
                    <strong>{menuNames[menuKey]}</strong>	
                  </div>
                ))
              }
            </div>
          </div>
        )}

        <main className="flex-grow bg-white">
          {children}
        </main>

        <footer className="h-[var(--footer-height)] bg-[var(--bg-footer-color)] text-white text-[0.65rem]">
          <div className='w-full h-full flex justify-center items-center'>
            &copy; 2025. ZHkim All Rights Reserved.
          </div>
        </footer>
      </body>
    </html>
    </ProviderWrapper>
  );
}
