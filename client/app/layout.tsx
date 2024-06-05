import React, { ReactNode } from 'react'
import '@/styles/.globals.css';
import { Metadata } from 'next'
import LanguageProvider from '@/context/Language';
import { MessageProvider } from '@/context/Message';
import { HeaderProvider } from '@/context/Header';
import { UserProvider } from '@/context/User';
import { Preloader } from '@/components/Preloader';
import { _server } from '@/dto/master'
import { Configuration } from '@impactium/config';
import { cookies } from 'next/headers';
import { Footer } from '@/components/footer/Footer';
import { redirect } from 'next/navigation';

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
  const cookie = cookies();

  const applicationInfo = await fetch(`${_server()}/api/application/info`, {
    cache: 'no-cache'
  }).then(async (response) => {
    return await response.json();
  }).catch(_ => { return null });

  const uuid = cookie.get('login_uuid')?.value
  const method = cookie.get('login_method')?.value
  const token = cookie.get('Authorization')?.value

  console.log(cookie.getAll())

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
    <html>
      <body style={{ backgroundColor: '#000000' }}>
        <LanguageProvider predefinedLanguage={cookie.get('_language')?.value}>
          <UserProvider prefetched={user} processLogin={uuid && method && !token}>
            <MessageProvider>
              <HeaderProvider>
                {Configuration.isProductionMode() && <Preloader applicationInfo={applicationInfo} />}
                <main>
                  {children}
                </main>
                <Footer />
              </HeaderProvider>
            </MessageProvider>
          </UserProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}