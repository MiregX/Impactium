/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: false,
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
        hostname: 'cdn.discordapp.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'cdn.impactium.fun',
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