/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Optimize webpack cache
    config.cache = {
      type: 'filesystem',
      buildDependencies: {
        config: [__filename],
      },
      maxAge: 172800000, // 2 days
    };

    // Optimize chunk size
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          default: false,
          vendors: false,
          commons: {
            name: 'commons',
            chunks: 'all',
            minChunks: 2,
          },
          shared: {
            name: 'shared',
            chunks: 'all',
            minChunks: 2,
            reuseExistingChunk: true,
          },
        },
      },
    };

    return config;
  },
  // Optimize image loading
  images: {
    domains: ['fonts.gstatic.com'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Enable React strict mode
  reactStrictMode: true,
  // Optimize production builds
  swcMinify: true,
}

module.exports = nextConfig 