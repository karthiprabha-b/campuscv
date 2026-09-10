import type { Metadata } from 'next';
import { Montserrat, Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-montserrat',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Tomasz Gajda — Front-end Developer & UI Designer',
  description: 'Senior Front-end Developer & UI Designer portfolio. Specializing in modern web applications, scalable design systems, and digital craftsmanship.',
  keywords: ['Tomasz Gajda', 'Front-end Developer', 'UI Designer', 'React', 'Next.js', 'TypeScript', 'Portfolio'],
  authors: [{ name: 'Tomasz Gajda' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${montserrat.variable} ${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="antialiased selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
        {children}
      </body>
    </html>
  );
}
