import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-2646aee0b232413d96760d797459863a.r2.dev",
      },
    ],
  },
};

export default nextConfig;
