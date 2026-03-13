import type { Metadata } from 'next';
import { Syne, JetBrains_Mono } from 'next/font/google';
import { ConvexClientProvider } from '@/app/ConvexProvider';
import './globals.css';
import { Analytics } from '@vercel/analytics/next';

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-syne',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jetbrains',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mrrstory.xyz';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'MRRStory — Shareable startup stories with verified MRR',
  description:
    'Generate shareable Wrapped-style stories from TrustMRR startup data. Search, explore verified MRR and growth, share in one click.',
  openGraph: {
    title: 'MRRStory — Shareable startup stories with verified MRR',
    description:
      'Generate shareable Wrapped-style stories from TrustMRR startup data. Search, explore verified MRR and growth, share in one click.',
    url: siteUrl,
    siteName: 'MRRStory',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MRRStory — Shareable startup stories with verified MRR',
    description:
      'Generate shareable Wrapped-style stories from TrustMRR startup data. Search, explore verified MRR and growth, share in one click.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${syne.variable} ${jetbrains.variable} font-sans antialiased`}
      >
        <ConvexClientProvider>{children}</ConvexClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
