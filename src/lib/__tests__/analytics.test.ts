import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  loadTrackers,
  onWhatsappClick,
  resetLoadedTrackers,
  trackContact,
  trackLead,
} from '../analytics';
import { resetSessionConsent, type Tracker, writeConsent } from '../trackers';

const ALL: Tracker[] = [
  { kind: 'ga4', id: 'G-ABC123' },
  { kind: 'meta', id: '123456789012345' },
  { kind: 'linkedin', id: '1234567' },
  { kind: 'tiktok', id: 'C4ABCDEFGHIJKLMNOPQR' },
];

type AnyWindow = Window & Record<string, unknown>;
const GLOBALS = [
  'dataLayer',
  'gtag',
  'fbq',
  '_fbq',
  'lintrk',
  '_linkedin_partner_id',
  '_linkedin_data_partner_ids',
  'ttq',
  'TiktokAnalyticsObject',
];

function trackerScripts(): string[] {
  return [...document.querySelectorAll('script[data-tracker]')].map(
    (script) => script.getAttribute('data-tracker') ?? '',
  );
}

beforeEach(() => {
  resetLoadedTrackers();
  resetSessionConsent();
  window.localStorage.clear();
});

afterEach(() => {
  vi.unstubAllEnvs();
  for (const script of document.querySelectorAll('script[data-tracker]')) {
    script.remove();
  }
  for (const key of GLOBALS) delete (window as unknown as AnyWindow)[key];
});

describe('loadTrackers', () => {
  it('loads nothing without consent', () => {
    loadTrackers(ALL);
    expect(trackerScripts()).toEqual([]);
    expect((window as unknown as AnyWindow).fbq).toBeUndefined();
  });

  it('loads nothing after the visitor refuses', () => {
    writeConsent('denied');
    loadTrackers(ALL);
    expect(trackerScripts()).toEqual([]);
  });

  it('injects only the enabled trackers, once each', () => {
    writeConsent('granted');
    loadTrackers([ALL[0], ALL[1]]);
    loadTrackers([ALL[0], ALL[1]]);

    expect(trackerScripts()).toEqual(['ga4', 'meta']);
    const sources = [...document.querySelectorAll('script[data-tracker]')].map(
      (script) => script.getAttribute('src'),
    );
    expect(sources).toEqual([
      'https://www.googletagmanager.com/gtag/js?id=G-ABC123',
      'https://connect.facebook.net/en_US/fbevents.js',
    ]);
  });

  it('uses the official script URLs for LinkedIn and TikTok', () => {
    writeConsent('granted');
    loadTrackers([ALL[2], ALL[3]]);

    const sources = [...document.querySelectorAll('script[data-tracker]')].map(
      (script) => script.getAttribute('src'),
    );
    expect(sources).toEqual([
      'https://snap.licdn.com/li.lms-analytics/insight.min.js',
      'https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=C4ABCDEFGHIJKLMNOPQR&lib=ttq',
    ]);
    expect((window as unknown as AnyWindow)._linkedin_data_partner_ids).toEqual(
      ['1234567'],
    );
  });
});

describe('events', () => {
  it('are no-ops without consent', () => {
    const fbq = vi.fn();
    (window as unknown as AnyWindow).fbq = fbq;

    trackLead({ score: 8, temperature: 'quente', budget: '20-50k' });
    trackContact('whatsapp');

    expect(fbq).not.toHaveBeenCalled();
  });

  it('are no-ops for a tracker that was not loaded', () => {
    writeConsent('granted');
    loadTrackers([ALL[0]]);
    const fbq = vi.fn();
    (window as unknown as AnyWindow).fbq = fbq;

    trackLead({ score: 8, temperature: 'quente', budget: '20-50k' });

    expect(fbq).not.toHaveBeenCalled();
  });

  it('report Lead and Contact to every loaded tracker', () => {
    writeConsent('granted');
    loadTrackers(ALL);
    const w = window as unknown as AnyWindow;
    const gtag = vi.fn();
    const fbq = vi.fn();
    const track = vi.fn();
    const lintrk = vi.fn();
    w.gtag = gtag;
    w.fbq = fbq;
    (w.ttq as { track: unknown }).track = track;
    w.lintrk = lintrk;

    trackLead({ score: 8, temperature: 'quente', budget: '20-50k' });
    onWhatsappClick();

    const details = { lead_score: 8, temperature: 'quente', budget: '20-50k' };
    expect(fbq).toHaveBeenCalledWith('track', 'Lead', details);
    expect(gtag).toHaveBeenCalledWith('event', 'generate_lead', details);
    expect(track).toHaveBeenCalledWith('SubmitForm', details);
    expect(fbq).toHaveBeenCalledWith('track', 'Contact', {
      channel: 'whatsapp',
    });
    expect(gtag).toHaveBeenCalledWith('event', 'contact', {
      method: 'whatsapp',
    });
    expect(track).toHaveBeenCalledWith('Contact', { channel: 'whatsapp' });
    // No conversion ID configured: LinkedIn counts nothing.
    expect(lintrk).not.toHaveBeenCalled();
  });

  it('counts a LinkedIn conversion only with a conversion ID', () => {
    vi.stubEnv('NEXT_PUBLIC_LINKEDIN_CONVERSION_ID', '987654');
    writeConsent('granted');
    loadTrackers([ALL[2]]);
    const lintrk = vi.fn();
    (window as unknown as AnyWindow).lintrk = lintrk;

    trackLead({ score: 4, temperature: 'morno', budget: '5-20k' });

    expect(lintrk).toHaveBeenCalledWith('track', { conversion_id: 987654 });
  });
});
