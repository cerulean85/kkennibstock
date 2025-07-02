import type { NextConfig } from "next";
import { codeInspectorPlugin } from "code-inspector-plugin";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },

  reactStrictMode: false,

  // 헤더 크기 제한 증가
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },

  async redirects() {
    return [
      {
        source: "/",
        destination: "/metrics",
        permanent: true, // true: 301 리다이렉트, false: 302 리다이렉트
      },
    ];
  },

  webpack(config, { dev, isServer }) {
    // code-inspector-plugin 활성화 (직접 경로 지정)
    if (dev && !isServer) {
      config.plugins.push(
        codeInspectorPlugin({
          bundler: "webpack",
          hotKeys: ["altKey"],
          // VS Code 직접 경로 지정 (사용자명을 실제 이름으로 변경하세요)
          editor: 'code'
        })
      );
    }
    return config;
  },

  // 헤더 크기 제한 설정 추가
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
    ];
  },
};

export default nextConfig;