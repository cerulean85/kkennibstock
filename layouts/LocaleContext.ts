import { createContext, useContext } from 'react';

export const LocaleContext = createContext<string>('ko'); // 기본값은 필요에 따라

export const useLocale = () => useContext(LocaleContext);