/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'files.stripe.com'
      }
    ]
  },
  sassOptions: {
    prependData: `@import "./styles/_import.scss";`
  }
};

module.exports = nextConfig;
