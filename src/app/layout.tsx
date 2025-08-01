import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Yargi SaaS - Turk Hukuk Sistemine Kapsamli Cozum',
  description: 'Turkiye nin 11 farkli hukuk kurumu icin gelistirilmis kapsamli SaaS cozumu. Hukuk, kararlar ve mevzuat arama, AI destekli analiz.',
  keywords: 'yargi, hukuk, saas, turkiye, mahkeme, karar, mevzuat, ai, analiz',
  authors: [{ name: 'Yargi SaaS Team' }],
  openGraph: {
    title: 'Yargi SaaS - Turk Hukuk Sistemine Kapsamli Cozum',
    description: 'Turkiye nin en kapsamli hukuk veri tabani ve analiz platformu',
    type: 'website',
    locale: 'tr_TR',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="scroll-smooth">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </body>
    </html>
  );
}