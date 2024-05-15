import React, { ReactNode } from 'react'
import '@/styles/.globals.css';
import { Metadata } from 'next'
import LanguageProvider from '@/context/Language';
import { MessageProvider } from '@/context/Message';
import { HeaderProvider } from '@/context/Header';
import { UserProvider } from '@/context/User';
import { Preloader } from '@/components/Preloader';
import { _server, requestApplicationInfoFromServer } from '@/dto/master'
import { CookiesConsemption } from '@/components/cookies/Cookies';
import { Configuration } from '@impactium/config';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: {
    template: '%s | Impactium',
    default: 'Impactium',
  },
  icons: {
    icon: 'https://cdn.impactium.fun/logo/impactium.png'
  },
  generator: 'Next.js',
  applicationName: 'Impactium',
  referrer: 'origin-when-cross-origin',
  keywords: ['Minecraft'],
  authors: [{ name: 'Mireg' }, { name: 'Herasymchuk Mark', url: 'https://impactium.fun/' }],
  creator: 'Herasymchuk Mark',
  publisher: 'Herasymchuk Mark',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  }
}

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const applicationInfo = await requestApplicationInfoFromServer();
  const cookie = cookies();

  const user = await fetch(_server() + '/api/user/get', {
      method: 'GET',
      headers: {
        token: cookie.get('Authorization')?.value
      }
    }).then(async res => {
      const user = await res.json()
      return res.ok ? user : null;
    }).catch(_ => { return null });

  return (
    <html>
      <body style={{ backgroundColor: '#000000' }}>
        <LanguageProvider predefinedLanguage={cookie.get('_language')?.value}>
          <UserProvider prefetched={user}>
            <MessageProvider>
              <HeaderProvider>
                {Configuration.isProductionMode() && <Preloader applicationInfo={applicationInfo} />}
                <main>
                  {children}
                </main>
              </HeaderProvider>
            </MessageProvider>
          </UserProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}