const MiniCssExtractPlugin = require('mini-css-extract-plugin');


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
  webpack: (config) => {
    config.module.rules.push({
      test: /\.css$/,
      use: [MiniCssExtractPlugin.loader, 'css-loader'],
    });

    config.plugins.push(new MiniCssExtractPlugin({
      filename: 'static/chunks/[name].css',
      chunkFilename: 'static/chunks/[id].css',
    }));

    return config;
  },
  env: {
    ENFORCED_PRELOADER: 'da',
  },
};