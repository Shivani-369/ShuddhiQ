/** @type {import('next').NextConfig} */
const basePath = process.env.NODE_ENV === 'production' ? '/ShuddhiQ' : '';

const nextConfig = {
  output: 'export',
  basePath: basePath,
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  trailingSlash: true,
};

export default nextConfig;
