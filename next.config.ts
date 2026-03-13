import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**", pathname: "/**" },
      { protocol: "http", hostname: "**", pathname: "/**" },
      { protocol: "https", hostname: "*.stripe.com", pathname: "/**" },
      { protocol: "https", hostname: "cdn.trustmrr.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
