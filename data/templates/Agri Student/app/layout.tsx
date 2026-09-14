import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Aarav Sharma | Agronomist & Precision AgriTech Portfolio',
  description: 'Portfolio of Aarav Sharma — Agricultural Sciences scholar specializing in Precision Agronomy, Multispectral Drone Mapping, Soil Microbiology, and IoT Smart Farming.',
  keywords: [
    'Agriculture Student',
    'Agronomy Portfolio',
    'Precision Agriculture',
    'AgriTech',
    'Drone Crop Scouting',
    'Soil Science',
    'Smart Farming',
    'Hydroponics',
    'NDVI Mapping'
  ],
  authors: [{ name: 'Aarav Sharma' }],
  openGraph: {
    title: 'Aarav Sharma | Agronomist & Precision AgriTech Portfolio',
    description: 'Pioneering sustainable agronomy through precision robotics, drone remote sensing, and soil biology.',
    type: 'website',
    images: ['/images/hero-agri.jpg'],
  },
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
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      </head>
      <body>{children}</body>
    </html>
  );
}
