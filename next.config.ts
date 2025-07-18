import type { NextConfig } from "next";
import nextTranslate from "next-translate-plugin";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
};

export default nextTranslate(nextConfig);
