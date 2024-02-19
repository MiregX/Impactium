import Header from '@/components/Header'
import "./globals.css";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html>
      <body>
        <Header />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
