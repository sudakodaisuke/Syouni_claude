import type { Metadata, Viewport } from 'next';
import './globals.css';
import { BottomNav } from '@/components/layout/BottomNav';

export const metadata: Metadata = {
  title: '小児薬量ドリル',
  description: '小児科の薬剤用量を効率よく暗記できるWebアプリ',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '小児薬量',
  },
};

export const viewport: Viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className="h-full" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full bg-slate-50 dark:bg-slate-900" style={{ fontFamily: '"Noto Sans JP", "Hiragino Sans", "Yu Gothic", sans-serif' }}>
        <main className="max-w-lg mx-auto pb-20 min-h-screen">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
