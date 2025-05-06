'use client';  // 클라이언트 전용 컴포넌트임을 명시

import { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/stores/store';

export default function CommonMain({ children }: { children: ReactNode }) {

	const isSpreadMainMenu: boolean = useSelector((state: RootState) => state.appConfig.isSpreadMainMenu);

  return (

			{children}

	)
}
