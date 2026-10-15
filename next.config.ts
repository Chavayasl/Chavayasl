import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 31 יום מטמון לתמונות אחרי אופטימיזציה — מקטין דרמטית את ה-egress מ-Supabase
    minimumCacheTTL: 2678400,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "ejrbydsnxtzpzklzolwn.supabase.co",
        pathname: "/storage/v1/object/**",
      },
    ],
  },
};

export default nextConfig;
