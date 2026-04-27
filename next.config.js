/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@boldmind-tech/auth',
    '@boldmind-tech/api-client',
    '@boldmind-tech/ui',
    '@boldmind-tech/utils',
    '@boldmind-tech/payments',
  ],
};

export default nextConfig;
