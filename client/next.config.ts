import type { NextConfig } from 'next'

const config: NextConfig = {
  transpilePackages: [
    '@impactium/components',
    '@impactium/icons'
  ],
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
}

export default config
