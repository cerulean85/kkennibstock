import type { NextConfig } from "next";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true
  },

  reactStrictMode: false,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/metrics',
        permanent: true, // true: 301 리다이렉트, false: 302 리다이렉트
      },
    ];
  }
};

export default withFlowbiteReact(nextConfig);