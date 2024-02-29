import React, { ReactNode } from 'react'
import '@/styles/globals.css';
import { Metadata } from 'next'
import LanguageProvider from '@/context/Language';
import { MessageProvider } from '@/context/Message';
import { HeaderProvider } from '@/context/Header';
import { UserProvider } from '@/context/User';
import { getUser } from '@/preset/User';
import { Preloader } from '@/context/Preloader';
export const metadata: Metadata = {
  title: {
    template: '%s | Impactium',
    default: 'Impactium',
  },
  generator: 'Next.js',
  applicationName: 'Impactium',
  referrer: 'origin-when-cross-origin',
  keywords: ['Minecraft', 'MinecraftServer', 'Український сервер майнкрафт', 'Сервер майнкрафт', 'войсчат сервер майнкрафт'],
  authors: [{ name: 'Mireg' }, { name: 'ChatGPT & Gemini' }, { name: 'Herasymchuk Mark', url: 'https://impactium.fun/' }],
  creator: 'Herasymchuk Mark',
  publisher: 'Herasymchuk Mark',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  }
}

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const user = await getUser();
  return (
    <html>
      <LanguageProvider>
        <UserProvider prefetchedUser={user}>
          <body style={{ backgroundColor: '#161616' }}>
            <HeaderProvider>
              <Preloader />
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