
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      }, 
     /*  remotePatterns: [
        {
          protocol: "http",
          hostname: "192.168.10.136",
          port: "1337",
          pathname: "/uploads/**",
        }, */
    ],
  },
 
  experimental: {
    serverActions: {
      bodySizeLimit: 50 * 1024 * 1024
    }
  }
};

export default nextConfig;

