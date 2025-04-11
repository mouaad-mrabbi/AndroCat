import type { NextConfig } from "next";

const redirects = async () => [
  {
    source: "/games/1",
    destination: "/games",
    permanent: true,
  },
  {
    source: "/admin/items",
    destination: "/admin/items/1",
    permanent: true,
  },
];

const nextConfig: NextConfig = {
  images: {
    domains: ["cacbbglbdrhnfhrmztmz.supabase.co"],
  },
  redirects,
};
export default nextConfig;
