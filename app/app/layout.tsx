import Header from '@/components/Header'
import "./globals.css";
import HeaderBackground from '@/components/HeaderBackground';
import { UserProvider } from '../context/UserContext';
import { Metadata } from 'next'
 
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
      <UserProvider>
        <body style={{ backgroundColor: '#242424' }}>
          <Header />
          <HeaderBackground />
          <main>
            {children}
          </main>
        </body>
      </UserProvider>
    </html>
  );
}
