/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/old_route',
        destination: '/new_route',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
