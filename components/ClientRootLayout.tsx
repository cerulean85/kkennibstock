"use client"
import "@/styles/common.scss"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TokenManager from '@/components/TokenManager';
import { RootState, UseSelector } from '@/stores/store';
import Loading from '@/components/Loading';
import { useLocale } from "@/layouts/LocaleContext";

export default function ClientRootLayout({
	children
}: {
	children: React.ReactNode;
}) {

	const menuNames: any = {
		"profit": "Profit",
		"metrics": "Metrics", 
		"news": "News"
	};

	const router = useRouter();
	const movePage = (menuKey: string) => {                     
		router.push(`/${menuKey}`); 
	}

	const menuKeys = Object.keys(menuNames);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
	const allPageLoading = UseSelector((state: RootState) => state.appConfig.allPageLoading);
	const locale = useLocale();

	return (
		
			<div className="flex flex-col min-h-screen mx-auto">    
				
				<TokenManager redirectPath={`/${locale}/login`} />
				{allPageLoading ? (
					<div className="flex flex-col items-center justify-center min-h-screen">
						<Loading />
					</div>
				) : (
				<div>
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
				</div> )}
 
			</div>

		
	);
}
