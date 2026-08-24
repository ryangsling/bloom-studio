import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Don't let `next dev` append framework rules to our own AGENTS.md.
  agentRules: false,
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
