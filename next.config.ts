import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    // Silence multiple-lockfile workspace root warning
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
