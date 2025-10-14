import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '', // Leave empty for default ports (80 for HTTP, 443 for HTTPS)
        pathname: '/drbqblivx/**', // Adjust based on your Cloudinary account; '**' allows all paths
      },
    ],
  },
};

export default nextConfig;