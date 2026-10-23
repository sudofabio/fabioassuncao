/**
 * Read by vinext (https://vinext.io), which builds the site on Vite and
 * honours the Next.js options below. `next build` is no longer used.
 *
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // Static export: vinext prerenders every route into dist/client/, which
  // scripts/finalize-export.mjs completes and Cloudflare Pages serves.
  output: 'export',

  // Allow dev server access from local network (mobile testing, etc.)
  allowedDevOrigins: ['http://192.168.*.*:3000'],

  images: {
    unoptimized: true,
  },

  trailingSlash: true,

  experimental: {
    optimizePackageImports: [
      '@fortawesome/react-fontawesome',
      '@fortawesome/fontawesome-svg-core',
    ],
  },
};

export default nextConfig;
