// Public site URL. Set NEXT_PUBLIC_SITE_URL once a custom domain exists;
// on Vercel it falls back to the project's production domain automatically.
const vercelHost =
  process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? (vercelHost ? `https://${vercelHost}` : "http://localhost:3000")
).replace(/\/$/, "");

export const SITE_HOST = new URL(SITE_URL).host;
