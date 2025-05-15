import type { NextConfig } from "next";

import "~/lib/env";
const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: "avatars.githubusercontent.com",
        protocol: "https",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
