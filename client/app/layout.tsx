import React, { ReactNode } from 'react'
import '@/styles/globals.css';
import { Metadata } from 'next'
import LanguageProvider from '@/context/Language';
import { MessageProvider } from '@/context/Message';
import { HeaderProvider } from '@/context/Header';
import { UserProvider } from '@/context/User';
import { getUser } from '@/dto/User';
import { Preloader } from '@/components/header/Preloader';
import { cookies } from 'next/headers';
import { requestApplicationInfoFromServer } from '@/dto/master'

export const metadata: Metadata = {
  title: {
    template: '%s | Impactium',
    default: 'Impactium',
  },
  icons: {
    icon: 'https://cdn.impactium.fun/logo/impactium_te8pad.png'
  },
  generator: 'Next.js',
  applicationName: 'Impactium',
  referrer: 'origin-when-cross-origin',
  keywords: ['Minecraft', 'MinecraftServer', 'Український сервер майнкрафт', 'Сервер майнкрафт', 'войсчат сервер майнкрафт'],
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
  const authorization = cookies().get('Authorization')?.value;
  const applicationInfo = await requestApplicationInfoFromServer();

  const user = await getUser(authorization);

  return (
    <html>
      <LanguageProvider>
        <UserProvider prefetchedUser={user}>
          <body style={{ backgroundColor: '#000000' }}>
            <HeaderProvider>
              <Preloader applicationInfo={applicationInfo} />
              <MessageProvider>
                <main>
                  {children}
                </main>
              </MessageProvider>
            </HeaderProvider>
          </body>
        </UserProvider>
      </LanguageProvider>
    </html>
  );
}