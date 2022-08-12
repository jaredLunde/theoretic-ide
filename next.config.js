/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  optimizeFonts: true,
  experimental: {
    reactRoot: true,
    swcFileReading: true,
    scrollRestoration: true,
  },
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 60 * 60 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 10,
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  eslint: {
    // Turns off ESLint during builds because we do it in an
    // earlier CI step
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Turns off type checking during builds becaues we do it in an
    // earlier CI step
    ignoreBuildErrors: true,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Vary",
            value: "Accept-Encoding",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
