import '@/decorator/api';
import '@/decorator/useOptionStyling';
import React from 'react'
import '@/public/.global.css';
import LanguageProvider from '@/context/Language.context';
import { ApplicationProvider } from '@/context/Application.context';
import { UserProvider } from '@/context/User.context';
import { Preloader } from './_components/Preloader';
import { cookies } from 'next/headers';
import { Footer } from '@/components/Footer';
import { User } from '@/dto/User.dto';
export { metadata } from '@/dto/Metadata';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Header } from '@/components/Header';
import { Api } from '@/dto/api.dto';
import { Toaster } from '@/ui/Toaster';
import { Children } from '@/types';
import { Application, ApplicationBase } from '@impactium/types';
import { Blueprint } from '@/dto/Blueprint.dto';

declare global {
  var api: Api;
  var useOptionStyling: (options: Record<string, any> | undefined, base: Record<string, string>) => string;
}

export default async function RootLayout({ children }: Children) {
  const cookie = cookies();

  const token = cookie.get('Authorization')?.value

  const user = token ? await api<User>('/user/get', {
    headers: {
      token
    }
  }) : null;

  const application = await api<Application>('/application/info') || ApplicationBase;
  const blueprints = await api<Blueprint[]>('/application/blueprints') || [];

  return (
    <html style={{'--font-mono' : GeistMono.style.fontFamily, '--font-sans' : GeistSans.style.fontFamily}}>
      <body style={{ backgroundColor: '#000000' }} data-scroll-locked='0'>
        <LanguageProvider predefinedLanguage={cookie.get('_language')?.value}>
          <UserProvider prefetched={user!}>
            <ApplicationProvider application={application} blueprints={blueprints}>
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
