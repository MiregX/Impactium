import '@/decorator/api';
import { Api } from '@/decorator/api';
import React from 'react'
import './globals.css';
import { LanguageProvider } from '@/context/Language.context';
import { cookies } from 'next/headers';
import { Footer } from '@/components/Footer';
export { metadata } from '@/dto/Metadata';
import { Nunito } from 'next/font/google'
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Header } from '@/components/Header';
import { Toaster } from '@/ui/Toaster';
import { Parent } from '@/types';
import { User, UserProvider } from '@/context/User.context';
import { ApplicationProvider } from '@/context/Application.context';
import { λCookie } from '@impactium/types';
import { cn } from '@impactium/utils';

const nunito = Nunito({
  preload: true,
  subsets: ['cyrillic', 'latin'],
  variable: '--font-nunito',
});

declare global {
  var api: Api;
  var useOptionStyling: (options: Record<string, any> | undefined, base: Record<string, string>) => string;
}

export default async function ({ children }: Parent) {
  const cookie = await cookies();

  const token = cookie.get(λCookie.Authorization)?.value

  const user = token ? await api<User.Interface>('/user/get', {
    headers: {
      token
    }
  }) : null;

  return (
    <html className={cn(nunito.variable, GeistMono.variable, GeistSans.variable)}>
      <body style={{ backgroundColor: '#000000' }} data-scroll-locked='0'>
        <LanguageProvider predefinedLanguage={cookie.get('_language')?.value}>
          <UserProvider prefetched={user!}>
            <ApplicationProvider>
              <Header />
              {children}
              <Toaster />
              <Footer />
            </ApplicationProvider>
          </UserProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
