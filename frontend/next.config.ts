import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
  /*  i18n: {
    locales: ['en', 'no'],  // Støtter engelsk og norsk
    defaultLocale: 'no',    // Standard språk er norsk
  }, */ /* config options here */
};

export default nextConfig;

