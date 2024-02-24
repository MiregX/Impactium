/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  serverRuntimeConfig: {
    disableReactStrictModeWarnings: true,
  },
  images: {
    loader: 'imgix',
    path: 'https://cdn.discordapp.com/',
    domains: ['cdn.discordapp.com'],
  },
};

export default nextConfig;
