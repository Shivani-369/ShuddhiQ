/** @type {import('next').NextConfig} */
const basePath = process.env.NODE_ENV === 'production' ? '/ShuddhiQ' : '';

const nextConfig = {
  output: 'export',
  basePath: basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  trailingSlash: true,
};

export default nextConfig;
