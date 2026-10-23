/**
 * The Content-Security-Policy the export ships, built from the trackers that
 * are switched on at build time.
 *
 * `public/_headers` carries the base policy (no trackers). The finalize step
 * rewrites that line in `dist/client/_headers` with `buildCsp(...)`, so an
 * origin is allowed only when its tracker can actually load. The env names and
 * ID patterns repeat `src/lib/trackers.ts`; `src/lib/__tests__/trackers.test.ts`
 * fails if the two drift.
 *
 * Origins, per vendor documentation:
 * - Google tag / GA4 without Ads features: "Use a Content Security Policy",
 *   developers.google.com/tag-platform/security/guides/csp
 * - Meta Pixel: fbevents.js from connect.facebook.net, events to
 *   www.facebook.com/tr (Meta Pixel base code)
 * - LinkedIn Insight Tag: hosts LinkedIn says must not be blocked,
 *   linkedin.com/help/lms/answer/a425696
 * - TikTok Pixel: events.js and its event endpoint on analytics.tiktok.com
 */

export const TRACKER_ENV = {
  ga4: 'NEXT_PUBLIC_GA_TRACKING_ID',
  meta: 'NEXT_PUBLIC_META_PIXEL_ID',
  linkedin: 'NEXT_PUBLIC_LINKEDIN_PARTNER_ID',
  tiktok: 'NEXT_PUBLIC_TIKTOK_PIXEL_ID',
};

export const TRACKER_PATTERNS = {
  ga4: /^G-[A-Z0-9]+$/,
  meta: /^\d{10,20}$/,
  linkedin: /^\d{4,12}$/,
  tiktok: /^[A-Z0-9]{15,30}$/,
};

/** Directive order of the emitted policy. */
const DIRECTIVES = [
  'default-src',
  'script-src',
  'style-src',
  'img-src',
  'font-src',
  'connect-src',
  'frame-src',
  'manifest-src',
  'object-src',
  'base-uri',
  'form-action',
  'frame-ancestors',
];

/**
 * The policy with no tracker enabled: this origin, Turnstile (contact chat) and
 * Cloudflare Web Analytics, which the Pages dashboard can inject.
 */
export const BASE_POLICY = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'",
    'https://challenges.cloudflare.com',
    'https://static.cloudflareinsights.com',
  ],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", 'data:'],
  'font-src': ["'self'"],
  'connect-src': [
    "'self'",
    'https://challenges.cloudflare.com',
    'https://cloudflareinsights.com',
  ],
  'frame-src': ['https://challenges.cloudflare.com'],
  'manifest-src': ["'self'"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"],
};

const LINKEDIN_PIXEL_HOSTS = [
  'https://px.ads.linkedin.com',
  'https://px4.ads.linkedin.com',
  'https://dc.ads.linkedin.com',
  'https://p.adsymptotic.com',
  'https://www.linkedin.com',
];

/** What each tracker adds, by directive. */
export const TRACKER_ORIGINS = {
  ga4: {
    'script-src': ['https://www.googletagmanager.com'],
    'img-src': [
      'https://www.googletagmanager.com',
      'https://*.google-analytics.com',
    ],
    'connect-src': [
      'https://www.googletagmanager.com',
      'https://*.google-analytics.com',
      'https://*.google.com',
    ],
  },
  meta: {
    'script-src': ['https://connect.facebook.net'],
    'img-src': ['https://www.facebook.com'],
    'connect-src': ['https://www.facebook.com', 'https://connect.facebook.net'],
  },
  linkedin: {
    'script-src': ['https://snap.licdn.com'],
    'img-src': LINKEDIN_PIXEL_HOSTS,
    'connect-src': LINKEDIN_PIXEL_HOSTS,
  },
  tiktok: {
    'script-src': ['https://analytics.tiktok.com'],
    'img-src': ['https://analytics.tiktok.com'],
    'connect-src': ['https://analytics.tiktok.com'],
  },
};

/** Trackers whose ID is present and well formed, read from an env object. */
export function enabledTrackerKinds(env = process.env) {
  return Object.keys(TRACKER_ENV).filter((kind) => {
    const id = env[TRACKER_ENV[kind]]?.trim();
    return Boolean(id) && TRACKER_PATTERNS[kind].test(id);
  });
}

/**
 * The full header value for the given tracker kinds. Sources keep the base
 * order, then each tracker's additions in the order given, without repeats.
 */
export function buildCsp(kinds = []) {
  const unknown = kinds.filter((kind) => !(kind in TRACKER_ORIGINS));
  if (unknown.length > 0) {
    throw new Error(`unknown tracker(s): ${unknown.join(', ')}`);
  }

  const parts = DIRECTIVES.map((directive) => {
    const sources = [...BASE_POLICY[directive]];
    for (const kind of kinds) {
      for (const source of TRACKER_ORIGINS[kind][directive] ?? []) {
        if (!sources.includes(source)) sources.push(source);
      }
    }
    return `${directive} ${sources.join(' ')}`;
  });

  return [...parts, 'upgrade-insecure-requests'].join('; ');
}

const CSP_LINE = /^(\s*)Content-Security-Policy:.*$/m;

/**
 * Replaces the single Content-Security-Policy line in a `_headers` file.
 * Throws when there is not exactly one, so a reworded file fails the build
 * instead of shipping without the policy.
 */
export function rewriteCspHeader(headers, policy) {
  const matches = headers.match(new RegExp(CSP_LINE.source, 'gm')) ?? [];
  if (matches.length !== 1) {
    throw new Error(
      `expected exactly one Content-Security-Policy line in _headers, found ${matches.length}`,
    );
  }
  return headers.replace(
    CSP_LINE,
    (_line, indent) => `${indent}Content-Security-Policy: ${policy}`,
  );
}
