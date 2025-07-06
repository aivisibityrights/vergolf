import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import MainNav from '@/components/navigation/main-nav' // แก้ path และ remove {}

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'VerGolf - จองสนามกอล์ฟ หาเพื่อนออกรอบ',
  description: 'แพลตฟอร์มกอล์ฟอันดับ 1 ของไทย รวมสนามกว่า 300 แห่งทั่วประเทศ จองง่าย จ่ายสะดวก หาเพื่อนออกรอบด้วย AI',
  keywords: 'กอล์ฟ, จองสนามกอล์ฟ, golf, booking, thailand golf, สนามกอล์ฟไทย, แคดดี้, หาเพื่อนออกรอบ',
  authors: [{ name: 'VerGolf Team' }],
  creator: 'VerGolf',
  publisher: 'VerGolf',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'VerGolf - จองสนามกอล์ฟ หาเพื่อนออกรอบ',
    description: 'แพลตฟอร์มกอล์ฟอันดับ 1 ของไทย รวมสนามกว่า 300 แห่งทั่วประเทศ',
    url: 'https://vergolf.com',
    siteName: 'VerGolf',
    images: [
      {
        url: 'https://vergolf.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'VerGolf - Golf Booking Platform',
      }
    ],
    locale: 'th_TH',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VerGolf - จองสนามกอล์ฟ หาเพื่อนออกรอบ',
    description: 'แพลตฟอร์มกอล์ฟอันดับ 1 ของไทย',
    images: ['https://vergolf.com/twitter-image.jpg'],
    creator: '@vergolf',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon-016.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon-032.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
      },
    ],
  },
  manifest: '/manifest.json',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#16a34a' },
    { media: '(prefers-color-scheme: dark)', color: '#14532d' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th" className={inter.className}>
      <head>
        {/* Additional meta tags if needed */}
        <meta name="application-name" content="VerGolf" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="VerGolf" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-screen bg-white antialiased">
        {/* Navigation Bar - ใช้ MainNav จริงๆ */}
        <MainNav />
        
        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="bg-gray-800 text-white py-8 mt-auto">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <p className="text-sm">© 2025 VerGolf. All rights reserved.</p>
              </div>
              <div className="flex space-x-6">
                <a href="/terms" className="text-sm hover:underline">
                  เงื่อนไขการใช้งาน
                </a>
                <a href="/privacy" className="text-sm hover:underline">
                  นโยบายความเป็นส่วนตัว
                </a>
                <a href="/contact" className="text-sm hover:underline">
                  ติดต่อเรา
                </a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}