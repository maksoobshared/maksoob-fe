import type { NextConfig } from "next";
import nextTranslate from "next-translate-plugin";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: [
      "www.byeq.net",
      "maksoob-dev-bucket.s3.me-central-1.amazonaws.com",
      "images.unsplash.com",
    ],
  },
};

export default nextTranslate(nextConfig);
