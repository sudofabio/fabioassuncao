import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  TRACKER_ENV as CSP_TRACKER_ENV,
  TRACKER_PATTERNS as CSP_TRACKER_PATTERNS,
} from '../../../scripts/lib/csp.mjs';
import {
  CONSENT_KEY,
  enabledTrackers,
  hasConsent,
  linkedinConversionId,
  readConsent,
  readTrackerIds,
  rememberConsent,
  resetSessionConsent,
  TRACKER_ENV,
  TRACKER_PATTERNS,
  writeConsent,
} from '../trackers';

const VALID = {
  ga4: 'G-ABC123XYZ',
  meta: '123456789012345',
  linkedin: '1234567',
  tiktok: 'C4ABCDEFGHIJKLMNOPQR',
};

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  window.localStorage.clear();
  resetSessionConsent();
});

describe('enabledTrackers', () => {
  it('enables nothing without IDs', () => {
    expect(enabledTrackers({})).toEqual([]);
  });

  it('returns every well-formed ID in a fixed order', () => {
    expect(
      enabledTrackers({
        tiktok: VALID.tiktok,
        ga4: VALID.ga4,
        linkedin: VALID.linkedin,
        meta: VALID.meta,
      }).map(({ kind }) => kind),
    ).toEqual(['ga4', 'meta', 'linkedin', 'tiktok']);
  });

  it.each([
    ['ga4', 'UA-12345-1'],
    ['ga4', "G-1');alert(1);('"],
    ['meta', '12345'],
    ['meta', '1234567890abc'],
    ['linkedin', '12'],
    ['linkedin', '12345"><script>'],
    ['tiktok', 'short'],
    ['tiktok', 'c4abcdefghijklmnopqr'],
  ] as const)('rejects a malformed %s ID (%s)', (kind, id) => {
    expect(enabledTrackers({ [kind]: id })).toEqual([]);
  });

  it('trims surrounding whitespace before validating', () => {
    expect(enabledTrackers({ ga4: `  ${VALID.ga4}\n` })).toEqual([
      { kind: 'ga4', id: VALID.ga4 },
    ]);
  });

  it('reads the build-time environment variables', () => {
    vi.stubEnv('NEXT_PUBLIC_GA_TRACKING_ID', VALID.ga4);
    vi.stubEnv('NEXT_PUBLIC_META_PIXEL_ID', VALID.meta);
    vi.stubEnv('NEXT_PUBLIC_LINKEDIN_PARTNER_ID', VALID.linkedin);
    vi.stubEnv('NEXT_PUBLIC_TIKTOK_PIXEL_ID', VALID.tiktok);

    expect(readTrackerIds()).toEqual(VALID);
    expect(enabledTrackers()).toHaveLength(4);
  });
});

describe('linkedinConversionId', () => {
  it('accepts only a numeric conversion ID', () => {
    expect(linkedinConversionId('987654')).toBe('987654');
    expect(linkedinConversionId('abc')).toBeUndefined();
    expect(linkedinConversionId(undefined)).toBeUndefined();
  });
});

describe('consent storage', () => {
  it('reads no choice until one is stored', () => {
    expect(readConsent()).toBeNull();
    expect(hasConsent()).toBe(false);
  });

  it('persists granted and denied under the versioned key', () => {
    writeConsent('granted');
    expect(window.localStorage.getItem(CONSENT_KEY)).toBe('granted');
    expect(hasConsent()).toBe(true);

    writeConsent('denied');
    expect(readConsent()).toBe('denied');
    expect(hasConsent()).toBe(false);
  });

  it('ignores an unknown stored value', () => {
    window.localStorage.setItem(CONSENT_KEY, 'yes');
    expect(readConsent()).toBeNull();
  });

  it('treats storage that throws as no choice, and remembers this page view', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });

    expect(readConsent()).toBeNull();
    expect(() => rememberConsent('granted')).not.toThrow();
    expect(hasConsent()).toBe(true);
  });
});

describe('agreement with the CSP generator', () => {
  it('uses the same env names and ID patterns as scripts/lib/csp.mjs', () => {
    expect(CSP_TRACKER_ENV).toEqual(TRACKER_ENV);
    for (const [kind, pattern] of Object.entries(TRACKER_PATTERNS)) {
      expect(
        (CSP_TRACKER_PATTERNS as Record<string, RegExp>)[kind]?.source,
      ).toBe(pattern.source);
    }
  });
});
