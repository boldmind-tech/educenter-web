import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {

  reactStrictMode: true,

  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Tell webpack to ignore node: built-ins on the client side
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: false,
        stream: false,
        buffer: false,
        util: false,
        url: false,
        querystring: false,
        path: false,
        os: false,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
      };
    }
    // Handle node: URI scheme
    config.externals = config.externals || [];
    if (isServer) {
      if (Array.isArray(config.externals)) {
        config.externals.push(({ request }, callback) => {
          if (request?.startsWith('node:')) {
            return callback(null, `commonjs ${request.replace('node:', '')}`);
          }
          callback();
        });
      }
    }
    return config;
  },

  transpilePackages: [
    '@boldmind-tech/ui',
    '@boldmind-tech/utils',
    '@boldmind-tech/auth',
    '@boldmind-tech/api-client',
    '@boldmind-tech/analytics',

  ],


  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: 'localhost' },
    ],
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  output: 'standalone',
};

export default nextConfig;