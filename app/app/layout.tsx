import Header from '@/components/Header'
import "./globals.css";
import HeaderBackground from '@/components/HeaderBackground';
import { UserProvider } from '../context/UserContext';
import LanguageProvider from '@/context/Language';
import Head from 'next/head';

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html>
      <Head>
        <style>
          {`
            body {
              background-color: #242424;
            }
          `}
        </style>
      </Head>
      <LanguageProvider>
        <UserProvider>
          <body style={{ backgroundColor: '#242424' }}>
            <Header />
            <HeaderBackground />
            <main>
              {children}
            </main>
          </body>
        </UserProvider>
      </LanguageProvider>
    </html>
  );
}
