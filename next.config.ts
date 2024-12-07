import type {NextConfig} from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  webpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@src': path.resolve(__dirname, 'src'),
    }
    return config
  },
  redirects: async () => {
    return [
      {
        source: '/home',
        destination: '/home',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
