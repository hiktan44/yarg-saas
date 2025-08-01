import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Yargı SaaS - Türk Hukuk Sistemine Kapsamlı Çözüm',
  description: 'Türkiye\'nin 11 farklı hukuk kurumu için geliştirilmiş kapsamlı SaaS çözümü. Hukuk, kararlar ve mevzuat arama, AI destekli analiz.',
  keywords: 'yargı, hukuk, saas, türkiye, mahkeme, karar, mevzuat, ai, analiz',
  authors: [{ name: 'Yargı Saas Team' }],
  openGraph: {
    title: 'Yargı SaaS - Türk Hukuk Sistemine Kapsamlı Çözüm',
    description: 'Türkiye\'nin en kapsamlı hukuk veri tabanı ve analiz platformu',
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
        {children}
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