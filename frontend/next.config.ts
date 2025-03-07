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
  /*  i18n: {
    locales: ['en', 'no'],  // Støtter engelsk og norsk
    defaultLocale: 'no',    // Standard språk er norsk
  }, */ /* config options here */
};

export default nextConfig;

