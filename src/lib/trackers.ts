/**
 * Measurement trackers the site can load, and the visitor's consent to them.
 *
 * Every tracker is off unless its public ID is set at build time and matches
 * its format, and nothing loads before the visitor accepts the banner in
 * `src/components/Template/Consent.tsx`. The same env names and patterns are
 * repeated in `scripts/lib/csp.mjs`, which opens the CSP only for the trackers
 * enabled here; `src/lib/__tests__/trackers.test.ts` keeps the two in step.
 */

export type TrackerKind = 'ga4' | 'meta' | 'linkedin' | 'tiktok';

export interface Tracker {
  kind: TrackerKind;
  id: string;
}

export type TrackerIds = Partial<Record<TrackerKind, string | undefined>>;

export const TRACKER_ENV: Record<TrackerKind, string> = {
  ga4: 'NEXT_PUBLIC_GA_TRACKING_ID',
  meta: 'NEXT_PUBLIC_META_PIXEL_ID',
  linkedin: 'NEXT_PUBLIC_LINKEDIN_PARTNER_ID',
  tiktok: 'NEXT_PUBLIC_TIKTOK_PIXEL_ID',
};

/**
 * Validated before any ID is written into a script URL or a snippet, so a
 * malformed build variable cannot inject markup.
 */
export const TRACKER_PATTERNS: Record<TrackerKind, RegExp> = {
  ga4: /^G-[A-Z0-9]+$/,
  meta: /^\d{10,20}$/,
  linkedin: /^\d{4,12}$/,
  tiktok: /^[A-Z0-9]{15,30}$/,
};

export const TRACKER_ORDER: readonly TrackerKind[] = [
  'ga4',
  'meta',
  'linkedin',
  'tiktok',
];

const LINKEDIN_CONVERSION_PATTERN = /^\d{4,12}$/;

/**
 * The build-time IDs. Each `process.env.NEXT_PUBLIC_*` is spelled out in full
 * because the bundler inlines only literal references, never a dynamic key.
 */
export function readTrackerIds(): TrackerIds {
  return {
    ga4: process.env.NEXT_PUBLIC_GA_TRACKING_ID,
    meta: process.env.NEXT_PUBLIC_META_PIXEL_ID,
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID,
    tiktok: process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID,
  };
}

/** Only the trackers whose ID is present and well formed, in a fixed order. */
export function enabledTrackers(ids: TrackerIds = readTrackerIds()): Tracker[] {
  return TRACKER_ORDER.flatMap((kind) => {
    const id = ids[kind]?.trim();
    return id && TRACKER_PATTERNS[kind].test(id) ? [{ kind, id }] : [];
  });
}

/** LinkedIn counts a conversion only against a configured conversion ID. */
export function linkedinConversionId(
  raw: string | undefined = process.env.NEXT_PUBLIC_LINKEDIN_CONVERSION_ID,
): string | undefined {
  const id = raw?.trim();
  return id && LINKEDIN_CONVERSION_PATTERN.test(id) ? id : undefined;
}

export const CONSENT_KEY = 'consent-v1';

export type ConsentChoice = 'granted' | 'denied';

/**
 * The stored choice, or `null` when there is none. Storage that throws
 * (private mode, blocked site data) reads as "no choice", so the banner asks
 * again rather than assuming consent.
 */
export function readConsent(): ConsentChoice | null {
  try {
    const value = window.localStorage.getItem(CONSENT_KEY);
    return value === 'granted' || value === 'denied' ? value : null;
  } catch {
    return null;
  }
}

/** Persists the choice; a storage failure keeps it for this page view only. */
export function writeConsent(choice: ConsentChoice): void {
  try {
    window.localStorage.setItem(CONSENT_KEY, choice);
  } catch {
    // Nothing to do: the in-memory choice still applies until navigation.
  }
}

let sessionChoice: ConsentChoice | null = null;

/** Remembers a choice made while storage is unavailable. */
export function rememberConsent(choice: ConsentChoice): void {
  sessionChoice = choice;
  writeConsent(choice);
}

export function hasConsent(): boolean {
  return (readConsent() ?? sessionChoice) === 'granted';
}

/** Test seam: forget the in-memory choice. */
export function resetSessionConsent(): void {
  sessionChoice = null;
}
