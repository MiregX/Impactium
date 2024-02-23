/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    loader: 'imgix',
    path: 'https://cdn.discordapp.com/',
    domains: ['cdn.discordapp.com'],
  },
};

export default nextConfig;
