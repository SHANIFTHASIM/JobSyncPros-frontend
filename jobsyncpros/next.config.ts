import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: isDev ? ['127.0.0.1'] : ['your-production-domain.com'],
  },
};

export default nextConfig;
