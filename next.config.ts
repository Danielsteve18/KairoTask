import type { NextConfig } from "next";
import withPWA from "@ducanh2912/next-pwa";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const securityHeaders = [
  // Evita MIME type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Previene clickjacking (CSP frame-ancestors es preferido, esto es el fallback)
  { key: "X-Frame-Options", value: "DENY" },
  // Controla referrer en cross-origin requests
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Restringe APIs de browser no usadas
  {
    key: "Permissions-Policy",
    value: "geolocation=(), microphone=(), camera=(), interest-cohort=()",
  },
  // HSTS — solo activo en producción con HTTPS
  ...(process.env.NODE_ENV === "production"
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ]
    : []),
];

const nextConfig: NextConfig = {
  turbopack: {},
  allowedDevOrigins: ["172.26.192.1", "localhost:3000"],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        // Supabase storage para avatares de usuario
        hostname: "fyrgssurrwqrayvsaeif.supabase.co",
      },
    ],
  },
};

const withPWAConfig = withPWA({
  dest: "public",
  register: true,
  disable: process.env.NODE_ENV === "development",
  scope: "/",
  sw: "sw.js",
  workboxOptions: {
    skipWaiting: true,
  },
})(nextConfig);

export default withNextIntl(withPWAConfig);

