import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  typescript: { tsconfigPath: "tsconfig.next.json" },
};

export default nextConfig;
