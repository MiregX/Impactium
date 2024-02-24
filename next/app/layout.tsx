import Header from '@/components/header/Header'
import '@/styles/globals.css';
import HeaderBackground from '@/components/header/HeaderBackground';
import { UserProvider } from '../context/User';
import { Metadata } from 'next'
import LanguageProvider from '@/context/Language';
import { MessageProvider } from '@/context/Message';
 
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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html>
      <LanguageProvider>
        <UserProvider>
          <body style={{ backgroundColor: '#161616' }}>
            <MessageProvider>
              <Header />
              <HeaderBackground />
              <main>
                {children}
              </main>
            </MessageProvider>
          </body>
        </UserProvider>
      </LanguageProvider>
    </html>
  );
}
