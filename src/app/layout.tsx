/* eslint-disable @next/next/no-img-element */

import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';

import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { draftMode } from 'next/headers';
import { VisualEditing } from 'next-sanity';
import Footer2 from '@/components/footer';
import Navbar1 from '@/components/navbar';
import BannerProvider from '@/components/providers/BannerProvider';
import { SessionProvider } from '@/components/providers/SessionProvider';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import config from '@/lib/config';
import { SanityLive } from '@/sanity/lib/live';

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: '--font-plus-jakarta-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  // Ensure base is a valid absolute URL (config already includes protocol in production)
  metadataBase: new URL(config.baseUrl ?? 'https://www.thefoundersclub.in'),
  title: {
    default: 'Founders Club',
    template: '%s | Founders Club',
  },
  description:
    'A community of founders building the future through innovation, collaboration, and student entrepreneurship.',
  applicationName: 'Founders Club',
  authors: [
    { name: 'Founders Club', url: config.baseUrl },
    { name: 'Suvan GS', url: 'https://www.suvangs.tech' },
    { name: 'Suvan Gowri Shanker', url: 'https://www.suvangs.tech' },
  ],
  creator: 'Founders Club',
  publisher: 'Founders Club',
  category: 'Business',
  classification: 'Business / Entrepreneurship / Innovation',
  keywords: [
    'founders club',
    'founders',
    'startup club',
    'student startups',
    'student entrepreneurship',
    'innovation hub',
    'SRMIST',
    'SRM University',
    'Kattankulathur',
    'hackathons',
    'workshops',
    'bootcamps',
    'webinars',
    'entrepreneurship community',
    'founder network',
    'university innovation',
    'DEI',
    'tech events',
    'product building',
    'venture building',
    'India startups',
    'youth innovation',
  ],
  alternates: {
    canonical: config.baseUrl,
  },
  openGraph: {
    title: 'Founders Club',
    description:
      'Connect with a vibrant ecosystem of student founders, builders, and innovators.',
    url: config.baseUrl,
    siteName: 'Founders Club',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: `${config.baseUrl}/FC-logo2.jpeg`,
        width: 640,
        height: 640,
        alt: 'Founders Club Primary Logo',
        type: 'image/jpeg',
      },
      {
        url: `${config.baseUrl}/FC-logo1.png`,
        width: 412,
        height: 255,
        alt: 'Founders Club Horizontal Logo',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Founders Club',
    description: 'Student founders building the future.',
    images: [`${config.baseUrl}/FC-logo2.jpeg`],
    creator: '@foundersclubsrm',
    site: '@foundersclubsrm',
  },
  icons: {
    icon: [{ url: '/favicon.ico' }, { url: '/icon.ico' }],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: ['/favicon.ico'],
  },
  manifest: '/site.webmanifest',
  verification: {
    google: 'k3IhMiinZTFIeLqq_luo4BRqfQ4lchHmKsDWkpGGoTg',
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
  appleWebApp: {
    capable: true,
    title: 'Founders Club',
    statusBarStyle: 'default',
  },
  other: {
    'color-scheme': 'light dark',
  },
};
function Noise() {
  return (
    <div
      className="pointer-events-none w-full h-full overflow-hidden absolute inset-0 z-0 opacity-10 [mask-image:radial-gradient(#fff,transparent,75%)]"
      style={{
        backgroundImage: 'url(/textures/noise.png)',
        backgroundSize: '30%',
      }}
    />
  );
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head>
        <meta
          name="google-site-verification"
          content="k3IhMiinZTFIeLqq_luo4BRqfQ4lchHmKsDWkpGGoTg"
        />
        <script
          data-collect-dnt="true"
          async
          src="https://scripts.simpleanalyticscdn.com/latest.js"
        />
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://queue.simpleanalyticscdn.com/noscript.gif?collect-dnt=true"
            alt=""
            referrerPolicy="no-referrer-when-downgrade"
          />
        </noscript>
      </head>
      <body
        className={`${plusJakartaSans.variable} antialiased w-full relative bg-background font-plusJK [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-track]:bg-transparent`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="fun"
          themes={['light', 'dark', 'fun', 'purple']}
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <BannerProvider />
            <Navbar1 />
            {children}
            <SanityLive />
            {(await draftMode()).isEnabled && <VisualEditing />}
            <Footer2 />
            <Toaster />
            <Noise />
          </SessionProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
