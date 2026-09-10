import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Julia Stiles — Designer / Developer Portfolio',
  description: 'Julie Creative Portfolio is specially designed product packaged for designers and developer portfolio websites.',
  keywords: ['Julia Stiles', 'Portfolio', 'Designer', 'Developer', 'UI/UX', 'Next.js'],
  authors: [{ name: 'Julia Stiles' }],
  openGraph: {
    title: 'Julia Stiles — Designer / Developer Portfolio',
    description: 'Julie Creative Portfolio is specially designed for designers and developers.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-4bw+/aepP/YC94hEpVNVgiZdgIC5+VKNBQNGCHeKRQN+PtmoHDEXuppvnDJzQIu9"
          crossOrigin="anonymous"
        />
        <link rel="stylesheet" type="text/css" href="/css/vendor.css" />
        <link rel="stylesheet" type="text/css" href="/css/style.css" />
      </head>
      <body className="bg-body homepage">{children}</body>
    </html>
  );
}
