import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Alexander Vance | Executive Legal Counsel & Strategic Advisory',
  description:
    'Executive luxury portfolio and template for legal counsel, software engineers, product designers, and corporate consultants.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased bg-[#FAF8F4] text-[#1A1A1A]">
        {children}
      </body>
    </html>
  );
}
