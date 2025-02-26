'use client';  // 클라이언트 전용 컴포넌트임을 명시

import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import store from '@/stores/store';

export default function ProviderWrapper({ children }: { children: ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
