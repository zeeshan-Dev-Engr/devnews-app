/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["media2.dev.to"],
  },
  experimental: {
    serverActions: {}, // ✅ instead of true
  },
}

module.exports = nextConfig
