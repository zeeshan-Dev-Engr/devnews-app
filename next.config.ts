/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Good practice for catching potential issues
  images: {
    domains: ["media2.dev.to"],
  },
  experimental: {
    // If you're using Next.js App Router (which you likely are), you can enable this
    serverActions: true,
  },
};

module.exports = nextConfig;


