import '@/decorator/api';
import '@/decorator/useClasses';
import '@/decorator/useDisplayName';
import '@/decorator/useOptionStyling';
import '@/decorator/useUsername';
import React, { ReactNode } from 'react'
import '@/public/.globals.css';
import LanguageProvider from '@/context/Language';
import { ApplicationProvider } from '@/context/Application';
import { HeaderProvider } from '@/context/Header';
import { UserProvider } from '@/context/User';
import { Preloader } from '@/components/Preloader';
import { Configuration } from '@impactium/config';
import { cookies } from 'next/headers';
import { Footer } from '@/components/footer/Footer';
import { User } from '@/dto/User';
export { metadata } from '@/dto/Metadata';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';

declare global {
  var api: (path: string, options?: RequestInit & { isRaw?: boolean, isText?: boolean }) => Promise<any>;
  var useClasses: (...classNames: Array<string | Array<string | string[]> | undefined | boolean>) => string;
  var useUsername: (user: User) => string;
  var useDisplayName: (user: User) => string;
  var useOptionStyling: (options: Record<string, any> | undefined, base: Record<string, string>) => string;
}

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const cookie = cookies();

  const application = await api('/application/info', {
    next: { revalidate: 600 }
  });

  const token = cookie.get('Authorization')?.value

  const user = token ? await api('/user/get', {
    method: 'GET',
    headers: {
      token: token
    }
  }) : null;

  return (
    <html style={{'--mono-geist' : GeistMono.variable, '--mono-sans' : GeistSans.variable}}>
      <body style={{ backgroundColor: '#000000' }}>
        <LanguageProvider predefinedLanguage={cookie.get('_language')?.value}>
          <UserProvider prefetched={user}>
            <ApplicationProvider prefetched={application}>
              <HeaderProvider>
                {Configuration.isProductionMode() && <Preloader use={!!cookie.get('uuid')} />}
                <main>
                  {children}
                </main>
                <Footer />
              </HeaderProvider>
            </ApplicationProvider>
          </UserProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
