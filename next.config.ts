import type { NextConfig } from "next";

// Security headers sent with every page and API response
const securityHeaders = [
  // Don't let other sites show our pages inside an <iframe> (stops "clickjacking")
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'" },
  // Browser must trust our Content-Type and not "guess" (stops files being run as scripts)
  { key: "X-Content-Type-Options", value: "nosniff" },
  // When a visitor clicks an outside link, only send our domain, not the full URL
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // We never need camera / mic / location — switch them off for the whole site
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  // Always use HTTPS for the next 2 years
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  // Hide the floating Next.js dev badge (it covered the docs sidebar)
  devIndicators: false,
  // Don't advertise "X-Powered-By: Next.js" to attackers scanning for versions
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
