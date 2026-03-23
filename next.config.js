/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    MAPBOX_TOKEN: process.env.MAPBOX_TOKEN,
    API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:5000',
  },
  images: {
    domains: ['res.cloudinary.com'],
  },
}

module.exports = nextConfig
