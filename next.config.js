/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  experimental: {
    appDir: true,
  },

  // Fixes workspace root detection for output tracing
  outputFileTracingRoot: __dirname,

  // Allow builds to continue even if ESLint errors exist
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
