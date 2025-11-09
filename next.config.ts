import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable subdomain support
  experimental: {
    // Middleware handles subdomain routing
  },
  
  // Optional: Configure remote patterns if using Next.js Image optimization with external images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dashboard.website.com',
      },
    ],
  },
};

export default nextConfig;
