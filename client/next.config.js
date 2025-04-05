/** @type {import('next').NextConfig} */

module.exports = {
  webpack: (config) => {
    config.devtool = false;
    return config;
  },
  images: {
    loader: 'default',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.telegram.org',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 't.me',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'cdn.discordapp.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'cdn.impactium.fun',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'avatars.steamstatic.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'robohash.org',
        port: '',
      }
    ]
  },
  logging: {
    fetches: {
      fullUrl: false,
    }
  }
};
