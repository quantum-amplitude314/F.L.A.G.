import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: { unoptimized: true },
  poweredByHeader: false,
};

export default nextConfig;
