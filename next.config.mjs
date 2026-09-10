/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  transpilePackages: ['lucide-react', 'framer-motion'],
  serverExternalPackages: ['better-sqlite3', 'pdf-parse', 'pdfjs-dist', 'tesseract.js'],
  experimental: {
    serverActions: {
      bodySizeLimit: '1024mb',
    },
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
};

export default nextConfig;
