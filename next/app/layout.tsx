import { ReactNode } from 'react'
import '@/styles/globals.css';
import { UserProvider } from '../context/User';
import { Metadata } from 'next'
import LanguageProvider from '@/context/Language';
import { MessageProvider } from '@/context/Message';
import { HeaderProvider } from '@/context/Header';
import cookie from '@/context/Cookie';
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
  const getUser = async () => {
    try {
      const response = await fetch('https://impactium.fun/api/user/get', {
        method: 'GET',
        headers: {
          'token': "test"
        }
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error)
    }
  };
  const user = await getUser();
  return (
    <html>
      <LanguageProvider>
        <UserProvider>
          <body style={{ backgroundColor: '#161616' }}>
            <HeaderProvider>
              <MessageProvider>
                <main>
                  <p>{user.email}</p>
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
