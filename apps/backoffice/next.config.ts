import type { NextConfig } from "next";
import path from "node:path";
const nextConfig: NextConfig = {
  output: "export",
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  images: {
    unoptimized: true,
    localPatterns: [
      {
        pathname: "/**",
      },
    ],
  },
  turbopack: {
    root: path.resolve(__dirname, "../.."),
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
};

export default nextConfig;
