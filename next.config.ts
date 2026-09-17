import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: { unoptimized: true },
  poweredByHeader: false,
  allowedDevOrigins: ["192.168.0.22"],
};

export default nextConfig;
