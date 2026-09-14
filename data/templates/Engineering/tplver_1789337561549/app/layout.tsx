import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Alex Mercer | Senior Full-Stack & Systems Architect',
  description:
    'Engineering portfolio of Alex Mercer — Senior Full-Stack & Systems Architect specializing in distributed cloud infrastructure, high-concurrency microservices, and modern web applications.',
  keywords: [
    'Software Engineer',
    'Systems Architect',
    'Full-Stack Developer',
    'Next.js Portfolio',
    'Kubernetes',
    'Distributed Systems',
    'Go',
    'TypeScript',
    'Cloud Architecture',
  ],
  authors: [{ name: 'Alex Mercer' }],
  openGraph: {
    title: 'Alex Mercer | Senior Full-Stack & Systems Architect',
    description:
      'Engineering portfolio showcasing distributed systems, cloud architecture, and modern full-stack web engineering.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
