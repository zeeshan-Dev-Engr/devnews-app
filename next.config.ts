/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["media2.dev.to"],
  },
  // ✅ Correct:
experimental: {
  serverActions: { enabled: true }
}

}

module.exports = nextConfig
