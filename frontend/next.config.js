/** @type {import('next').NextConfig} */
const API_TARGET = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

const nextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      { source: '/api/:path*', destination: `${API_TARGET}/api/:path*` },
    ]
  },
}

module.exports = nextConfig
