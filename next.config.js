/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  experimental: {
    appDir: true,
  },

  // Fixes workspace root detection for output tracing
  outputFileTracingRoot: __dirname,

  // Ignore ESLint errors during Vercel builds
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
