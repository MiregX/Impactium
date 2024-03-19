const MiniCssExtractPlugin = require('mini-css-extract-plugin');

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
      exclude: /\.module\.css$/,
      use: [MiniCssExtractPlugin.loader, 'css-loader'],
    });

    config.module.rules.push({
      test: /\.module\.css$/,
      use: [MiniCssExtractPlugin.loader, {
        loader: 'css-loader',
        options: {
          modules: true,
        },
      }],
    });

    config.plugins.push(new MiniCssExtractPlugin());

    return config;
  },
};
