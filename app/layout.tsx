import React from "react"
import type { Metadata, Viewport } from 'next'
import { Prompt, Poppins, Noto_Sans_Thai } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { CartProvider } from "@/components/thunder/cart-context"
import { NotificationProvider } from "@/components/thunder/notification-popup"

const prompt = Prompt({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-prompt"
});

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins"
});

const notoSansThai = Noto_Sans_Thai({ 
  subsets: ["thai"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-thai"
});

export const metadata: Metadata = {
  title: 'Thunder Delivery - สั่งอาหารออนไลน์',
  description: 'บริการส่งอาหารที่รวดเร็วที่สุด สั่งอาหารจากร้านดังใกล้บ้านคุณ พร้อมโปรโมชั่นสุดพิเศษ',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#FFD700',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

import { GlobalRealtimeListener } from "@/components/thunder/global-realtime-listener"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="th" className={`${prompt.variable} ${poppins.variable} ${notoSansThai.variable}`}>
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      </head>
      <body className="font-sans antialiased font-thai">
        <CartProvider>
          <NotificationProvider>
            {children}
            <GlobalRealtimeListener />
            <Toaster />
            <Analytics />
          </NotificationProvider>
        </CartProvider>
      </body>
    </html>
  )
}
