import Header from '@/components/Header'
import "./globals.css";
import HeaderBackground from '@/components/HeaderBackground';
import { UserProvider } from '../context/UserContext';

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
