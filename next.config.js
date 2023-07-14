/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "frenome.s3.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
