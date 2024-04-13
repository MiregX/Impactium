/** @type {import('next').NextConfig} */
const path = require('path');
const dotenv = require('dotenv');
const webpack = require('webpack');
const { parsed: env } = dotenv.config({ path: `../${!process.env.X ? 'dev' : ''}.env` });

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
};
