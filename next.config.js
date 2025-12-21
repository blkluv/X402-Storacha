/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@coinbase/cdp-sdk'],
  },
};

export default nextConfig;