import type { Metadata } from 'next';

import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { SessionProvider } from '@/components/providers/SessionProvider';
import Navbar1 from '@/components/navbar';
import Footer2 from '@/components/footer';
import { Toaster } from '@/components/ui/toaster';
import config from '@/lib/config';
import BannerProvider from '@/components/providers/BannerProvider';

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: '--font-plus-jakarta-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(`https://${config.baseUrl}`),
  title: 'Founders Club',
  description: 'A community of founders building the future',
  openGraph: {
    title: 'Founders Club',
    images: [
      {
        url: `${config.baseUrl}/FC-logo2.jpeg`,
        width: 640,
        height: 640,
        alt: 'Founders Club Logo',
      },
      {
        url: `${config.baseUrl}/FC-logo1.png`,
        width: 412,
        height: 255,
        alt: 'Founders Club Logo',
      },
    ],
    description: 'A community of founders building the future',
    url: config.baseUrl,
    siteName: 'Founders Club',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Founders Club',
    description: 'A community of founders building the future',
    images: [
      `${config.baseUrl}/FC-logo2.jpeg`,
      `${config.baseUrl}/FC-logo1.png`,
    ],
    creator: '@foundersclubsrm',
  },
  creator: 'Founders Club',
  applicationName: 'Founders Club',
  authors: [
    {
      name: 'Founders Club',
      url: config.baseUrl,
    },
    {
      name: 'Suvan GS',
      url: 'https://www.suvangs.tech',
    },
    {
      name: 'Suvan Gowri Shanker',
      url: 'https://www.suvangs.tech',
    },
  ],
  category: 'Business',
  classification: 'Business',
  publisher: 'Founders Club',
  keywords: [
    'founders',
    'club',
    'community',
    'startups',
    'entrepreneurs',
    'DEI',
    'founders club',
    'entrepreneurship',
    'Directorate of Entrepreneurship and Innovation',
    'SRM Institute of Science and Technology',
    'SRMIST',
    'SRM',
    'SRM University',
    'SRMIST Chennai',
    'SRM Chennai',
    'SRM Kattankulathur',
    'SRMIST Kattankulathur',
    'SRMIST Ramapuram',
    'Student Entrepreneurship',
    'Student Innovation',
    'Student Startups',
  ],
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
};
function Noise() {
  return (
    <div
      className="pointer-events-none w-full h-full overflow-hidden absolute inset-0 z-0 opacity-10 [mask-image:radial-gradient(#fff,transparent,75%)]"
      style={{ backgroundImage: 'url(/textures/noise.png)', backgroundSize: '30%' }}
    />
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <body
        className={`${plusJakartaSans.variable} antialiased w-full relative bg-background font-plusJK [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-track]:bg-transparent`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          themes={['light', 'dark', 'system']}
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <BannerProvider />
            <Navbar1 />
            {children}
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
