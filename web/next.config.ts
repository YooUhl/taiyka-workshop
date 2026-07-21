import type { NextConfig } from "next";

// 'unsafe-eval' is only needed in development (React uses eval for enhanced
// error stacks). Per the installed Next 16 CSP guide it is NOT needed in prod.
const isDev = process.env.NODE_ENV === "development";

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://assets.calendly.com`,
      "style-src 'self' 'unsafe-inline' https://assets.calendly.com",
      "frame-src https://calendly.com https://*.calendly.com",
      "connect-src 'self' https://calendly.com https://*.calendly.com",
      "img-src 'self' data: https:",
      "font-src 'self' data: https://assets.calendly.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=()",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  // /products is retired — the catalog lives at /shop now. Permanent 301s so
  // indexed URLs and old social links keep resolving. Query strings (?lang=en)
  // are carried over automatically.
  async redirects() {
    return [
      {
        source: "/products",
        destination: "/shop",
        permanent: true,
      },
      {
        source: "/products/prospect-audit-funnel",
        destination: "/shop",
        permanent: true,
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/og/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
