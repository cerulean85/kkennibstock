'use client';
import { LocaleContext } from './LocaleContext';

export default function MemberSection({ 
	locale, 
	children
}: { 
	locale: string, 
  children: React.ReactNode;
}) {

  return (
		<LocaleContext.Provider value={locale}>
		<section>
			{children}
		</section>
		</LocaleContext.Provider>
	)
}
