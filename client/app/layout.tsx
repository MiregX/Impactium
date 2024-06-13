import '@/dto/GlobalGet';
import React, { ReactNode } from 'react'
import '@/public/.globals.css';
import { Metadata } from 'next'
import LanguageProvider from '@/context/Language';
import { ApplicationProvider } from '@/context/Application';
import { HeaderProvider } from '@/context/Header';
import { UserProvider } from '@/context/User';
import { Preloader } from '@/components/Preloader';
import { _server } from '@/dto/master'
import { Configuration } from '@impactium/config';
import { cookies } from 'next/headers';
import { Footer } from '@/components/footer/Footer';
import localFont from 'next/font/local'
import { metadata } from '@/dto/Metadata';
import { cookieSettings } from '@impactium/pattern';
export { metadata };
const GeistMonoFont = localFont({ src: '../public/GeistMono.woff2'});

declare global {
  var get: (path: string | URL | RequestInfo, options?: RequestInit & { isRaw?: boolean, isText?: boolean }) => Promise<any>;
}

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const cookie = cookies();

  const application = await get('/api/application/info', {
    next: { revalidate: 600 }
  });

  const token = cookie.get('Authorization')?.value

  const user = token ? await get('/api/user/get', {
    method: 'GET',
    headers: {
      token: token
    }
  }) : null;

  return (
    <html style={{'--mono-geist' : GeistMonoFont.style.fontFamily} as unknown}>
      <body style={{ backgroundColor: '#000000' }}>
        <LanguageProvider predefinedLanguage={cookie.get('_language')?.value}>
          <UserProvider prefetched={user}>
            <ApplicationProvider prefetched={application}>
              <HeaderProvider>
                {Configuration.isProductionMode() && <Preloader />}
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
