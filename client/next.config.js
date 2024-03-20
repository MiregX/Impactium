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
    // Настройка правил для загрузки CSS файлов
    config.module.rules.push({
      test: /\.css$/,
      use: [
        MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: {
            modules: {
              localIdentName: '[name]_[local]_[hash:base64:5]',
            },
          },
        },
      ],
    });
    config.plugins.push(
      new MiniCssExtractPlugin({
        filename: 'static/chunks/[name].css',
        chunkFilename: 'static/chunks/[id].css',
      })
    );

    return config;
  },
  env: {
    // ENFORCED_PRELOADER: 'true',
  },
  logging: {
    fetches: {
      fullUrl: true,
    }
  }
};