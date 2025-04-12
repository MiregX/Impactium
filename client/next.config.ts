import type { NextConfig } from 'next'

const config: NextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
}

export default config
