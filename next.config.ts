import type { NextConfig } from "next";

const redirects = async () => [
  {
    source: "/games/1",
    destination: "/games",
    permanent: true,
  },
  {
    source: "/admin/articles",
    destination: "/admin/articles/1",
    permanent: true,
  },
];

const nextConfig: NextConfig = {
  images: {
    domains: ["cdn.androcat.com"],
  },
  redirects,
};
export default nextConfig;
