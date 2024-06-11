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
const GeistMonoFont = localFont({ src: '../public/GeistMono.woff2'});  

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
  },
}

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const cookie = cookies();

  const application = await fetch(`${_server()}/api/application/info`, {
    cache: 'no-cache'
  }).then(async (response) => {
    return await response.json();
  }).catch(_ => { return null });

  const uuid = cookie.get('uuid')?.value
  const token = cookie.get('Authorization')?.value

  const user = token ? await fetch(_server(true) + '/api/user/get', {
      method: 'GET',
      headers: {
        token: token
      }
    }).then(async res => {
      const user = await res.json();
      return res.ok ? user : null;
    }).catch(_ => { return null }) : null;

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