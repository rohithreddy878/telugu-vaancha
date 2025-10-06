/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ⚠ Remove outdated experimental flags
  // (Next.js 15+ has appDir by default)
  // experimental: {
  //   appDir: true,
  // },

  // Optional: keep this only if you’re using a monorepo
  // outputFileTracingRoot: __dirname,

  //  Properly disable ESLint errors during builds
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
