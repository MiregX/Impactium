import React, { ReactNode } from 'react'
import '@/styles/.globals.css';
import { Metadata } from 'next'
import LanguageProvider from '@/context/Language';
import { MessageProvider } from '@/context/Message';
import { HeaderProvider } from '@/context/Header';
import { UserProvider } from '@/context/User';
import { Preloader } from '@/components/Preloader';
import { requestApplicationInfoFromServer } from '@/dto/master'
import Settings from '@/components/Settings';
import { CookiesConsemption } from '@/components/Cookies';
import { Configuration } from '@impactium/config';

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

  return (
    <html>
      <body style={{ backgroundColor: '#000000' }}>
        <LanguageProvider>
          <UserProvider>
              <HeaderProvider>
                {Configuration.isProductionMode() && <Preloader applicationInfo={applicationInfo} />}
                <MessageProvider>
                  <main>
                    {children}
                  </main>
                </MessageProvider>
                <CookiesConsemption />
                <Settings />
              </HeaderProvider>
          </UserProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}