import '@/decorator/api';
import '@/decorator/useClasses';
import '@/decorator/useOptionStyling';
import React, { ReactNode } from 'react'
import '@/public/.global.css';
import LanguageProvider from '@/context/Language.context';
import { ApplicationProvider } from '@/context/Application.context';
import { UserProvider } from '@/context/User.context';
import { Preloader } from '@/components/Preloader';
import { Configuration } from '@impactium/config';
import { cookies } from 'next/headers';
import { Footer } from '@/components/Footer';
import { User } from '@/dto/User';
export { metadata } from '@/dto/Metadata';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Header } from '@/components/Header';
import { Api } from '@/dto/api.dto';
import { Toaster } from '@/ui/Toaster';

declare global {
  var api: Api;
  var useClasses: (...classNames: Array<string | Array<string | string[]> | undefined | boolean>) => string;
  var useOptionStyling: (options: Record<string, any> | undefined, base: Record<string, string>) => string;
}

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const cookie = cookies();

  const token = cookie.get('Authorization')?.value

  const user = token ? await api<User>('/user/get', {
    headers: {
      token
    }
  }) : null

  return (
    <html style={{'--font-mono' : GeistMono.style.fontFamily, '--font-sans' : GeistSans.style.fontFamily}}>
      <body style={{ backgroundColor: '#000000' }}>
        <LanguageProvider predefinedLanguage={cookie.get('_language')?.value}>
          <UserProvider prefetched={user}>
            <ApplicationProvider>
              <Header />
              <Preloader />
              <main>
                {children}
              </main>
              <Toaster />
              <Footer />
            </ApplicationProvider>
          </UserProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
