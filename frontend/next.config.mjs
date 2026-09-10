/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  ...(isProd ? { output: 'export' } : {}),
  trailingSlash: true,
  reactStrictMode: true,
  images: {
    unoptimized: true, // required for static export
  },
};

export default nextConfig;
