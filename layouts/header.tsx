"use client";
// import { usePathname  } from 'next/navigation';
// import { useSelector, useDispatch } from 'react-redux';
// import { RootState, AppDispatch } from '@/stores/store';

// import {
//   setIsSpreadMainMenu
//  } from '@/stores/appConfigSlice';
// import {
//   getMenunameFromURL
//  } from '@/lib/domain';
//  import Image from "next/image";

const CommonHeader = () => {
  // const dispatch: AppDispatch = useDispatch();

  // const pathname = usePathname();
  // const menuname = getMenunameFromURL(pathname);

  return (
    <header>
      {/* <div className="flex justify-between" >
        
        <div className="flex current-dir">
          <div className='flex items-center ms-3'>
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
      </div> */}
    </header>
  );
};

export default CommonHeader;
