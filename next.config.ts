import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Tambahkan blok async rewrites di sini
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://172.16.177.202:8000/api/:path*', // URL ke backend Laravel Anda
      },
    ];
  },
};

export default nextConfig;
