/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack']
    });

    return config;
  },
  reactStrictMode: false,
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
