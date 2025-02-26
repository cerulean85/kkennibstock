"use client"
import { usePathname  } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/stores/store';

import { 
  setIsSpreadMainMenu
 } from '@/stores/appConfigSlice';
import { 
  getMenunameFromURL
 } from '@/lib/domain';
 import Image from "next/image";

const CommonHeader = () => {
  const dispatch: AppDispatch = useDispatch();

  const pathname = usePathname();
  const menuname = getMenunameFromURL(pathname);
  const isSpreadMainMenu: boolean = useSelector((state: RootState) => state.appConfig.isSpreadMainMenu);

  const spreadMenu = () => { dispatch(setIsSpreadMainMenu(true)); };

  return (
    <header>
      <div className="d-flex justify-content-between" >
        
        <div className="d-flex current-dir">
          <div className='d-flex align-items-center ms-3'>
            <strong>{menuname}</strong>
          </div>       
        </div>

        <div className="p-3 d-flex top-menu-bar">
          <div className='mx-1'>
            <a title="My Page">
              <Image src="/images/icon/ic_logout.svg" width={28} height={28} alt='mypage'/>
            </a>
          </div>        
        </div>
      </div>
    </header>
  )
}

export default CommonHeader