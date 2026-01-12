/** @type {import('next').NextConfig} */
const nextConfig = {
  // Docker環境でのホットリロードを有効化
  webpack: (config) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    };
    return config;
  },
};

module.exports = nextConfig;
