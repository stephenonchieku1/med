import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css'
import { UserProvider } from './context/UserContext';
import { Toaster } from 'react-hot-toast'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: 'Medlex.ai - Your Healthcare Assistant',
  description: 'Get instant answers to your healthcare questions in multiple languages',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>
          {children}
          <Toaster position="bottom-right" />
        </UserProvider>
      </body>
    </html>
  )
} 