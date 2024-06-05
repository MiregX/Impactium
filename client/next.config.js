/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: false,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias['@react-frontend'] = '@react-frontend';
    }
    return config;
  },
  serverRuntimeConfig: {
    disableReactStrictModeWarnings: true,
  },
  images: {
    loader: 'default',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: '*.telegram.org',
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
      }
    ]
  },
  logging: {
    fetches: {
      fullUrl: false,
    }
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};
