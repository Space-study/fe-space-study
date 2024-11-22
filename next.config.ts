import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@src": path.resolve(__dirname, "src"), // Define the alias for `@src`
    };
    return config;
  },
};

export default nextConfig;
