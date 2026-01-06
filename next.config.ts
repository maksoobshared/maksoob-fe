import type { NextConfig } from "next";
import nextTranslate from "next-translate-plugin";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: [
      "localhost",
      "127.0.0.1",
      "37.60.243.151",
      "www.byeq.net",
      "maksoob-dev-bucket.s3.me-central-1.amazonaws.com",
      "images.unsplash.com",
    ],
  },
};

export default nextTranslate(nextConfig);
