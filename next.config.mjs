import bundleAnalyzer from '@next/bundle-analyzer';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',

  // Allow dev server access from local network (mobile testing, etc.)
  allowedDevOrigins: ['http://192.168.*.*:3000'],

  images: {
    unoptimized: true,
  },

  trailingSlash: true,

  // Turbopack configuration (used in development)
  turbopack: {
    resolveExtensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },

  // Experimental features
  experimental: {
    // TypeScript 7 is the native compiler and does not expose the JavaScript
    // compiler API that Next's build-time type check reaches for, so the build
    // fails outright without this. Shelling out to the TypeScript CLI is the
    // path Next itself names in that error. Verified that type errors still
    // fail the build under this flag — see AGENTS.md.
    useTypeScriptCli: true,

    optimizePackageImports: [
      '@fortawesome/react-fontawesome',
      '@fortawesome/fontawesome-svg-core',
    ],
  },
};

// Served from the root of the Cloudflare Pages project `fabioassuncao`, so no
// basePath is needed (see wrangler.jsonc).
if (process.env.ANALYZE === 'true') {
  Object.assign(nextConfig, bundleAnalyzer({ enabled: true })(nextConfig));
}

export default nextConfig;
