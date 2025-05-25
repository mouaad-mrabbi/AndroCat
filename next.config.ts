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
     unoptimized: true,// <--- هذا هو المفتاح لمنع المرور عبر /_next/image
    domains: ["cdn.androcat.com"],
  },
  redirects,
};
export default nextConfig;
