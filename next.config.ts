import type {NextConfig} from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      // Alias 'underscore' to 'lodash' and 'mocha' to the browser-compatible entry
      resolveAlias: {
        underscore: 'lodash',
        mocha: {browser: 'mocha/browser-entry.js'},
      },
      // Set module ID strategy to 'deterministic' to ensure consistent module IDs
      moduleIdStrategy: 'deterministic',
      // Define the file extensions to resolve
      resolveExtensions: ['.mdx', '.tsx', '.ts', '.jsx', '.js', '.mjs', '.json'],
    },
  },
  webpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@src': path.resolve(__dirname, 'src'), // Define the alias for `@src`
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
  //add domain src get imgage here
  images: {
    domains: ['museumhack.com', 'media.licdn.com', 'www.dragosroua.com'],
  },
}

export default nextConfig
