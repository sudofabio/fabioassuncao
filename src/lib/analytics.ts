import {
  enabledTrackers,
  hasConsent,
  linkedinConversionId,
  type Tracker,
} from './trackers';

/**
 * Loads the enabled trackers after consent and reports the two events the
 * funnel measures: `Lead` when the /contato/ chat completes, `Contact` when a
 * WhatsApp link is clicked. Every call is a no-op without consent or when the
 * tracker is not enabled, so callers never need to check first.
 */

type Queue = (...args: unknown[]) => void;

interface TrackerWindow {
  dataLayer?: unknown[];
  gtag?: Queue;
  fbq?: Queue & { queue?: unknown[]; loaded?: boolean; version?: string };
  _fbq?: unknown;
  lintrk?: Queue & { q?: unknown[] };
  _linkedin_partner_id?: string;
  _linkedin_data_partner_ids?: string[];
  ttq?: TikTokQueue;
  TiktokAnalyticsObject?: string;
}

type TikTokQueue = unknown[] & {
  methods?: string[];
  setAndDefer?: (target: TikTokQueue, method: string) => void;
  load?: (id: string) => void;
  page?: Queue;
  track?: Queue;
  _i?: Record<string, unknown[] & { _u?: string }>;
  _t?: Record<string, number>;
  _o?: Record<string, Record<string, unknown>>;
};

const SCRIPT_ATTRIBUTE = 'data-tracker';

function trackerWindow(): TrackerWindow {
  return window as unknown as TrackerWindow;
}

function appendScript(kind: string, src: string): void {
  if (document.querySelector(`script[${SCRIPT_ATTRIBUTE}="${kind}"]`)) return;
  const script = document.createElement('script');
  script.async = true;
  script.src = src;
  script.setAttribute(SCRIPT_ATTRIBUTE, kind);
  document.head.appendChild(script);
}

/** Google tag (gtag.js), as in Google's GA4 install snippet. */
function loadGa4(id: string): void {
  const w = trackerWindow();
  w.dataLayer = w.dataLayer ?? [];
  w.gtag =
    w.gtag ??
    function gtag() {
      w.dataLayer?.push(arguments);
    };
  w.gtag('js', new Date());
  w.gtag('config', id);
  appendScript(
    'ga4',
    `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`,
  );
}

/** Meta Pixel base code (fbevents.js) with its PageView. */
function loadMeta(id: string): void {
  const w = trackerWindow();
  if (!w.fbq) {
    const fbq = function fbq(...args: unknown[]) {
      const self = fbq as unknown as {
        callMethod?: (...a: unknown[]) => void;
        queue: unknown[];
      };
      if (self.callMethod) self.callMethod(...args);
      else self.queue.push(args);
    } as NonNullable<TrackerWindow['fbq']>;
    fbq.queue = [];
    fbq.loaded = true;
    fbq.version = '2.0';
    (fbq as unknown as { push: unknown }).push = fbq;
    w.fbq = fbq;
    w._fbq = w._fbq ?? fbq;
  }
  w.fbq('init', id);
  w.fbq('track', 'PageView');
  appendScript('meta', 'https://connect.facebook.net/en_US/fbevents.js');
}

/** LinkedIn Insight Tag (insight.min.js). */
function loadLinkedin(id: string): void {
  const w = trackerWindow();
  w._linkedin_partner_id = id;
  w._linkedin_data_partner_ids = w._linkedin_data_partner_ids ?? [];
  if (!w._linkedin_data_partner_ids.includes(id)) {
    w._linkedin_data_partner_ids.push(id);
  }
  if (!w.lintrk) {
    const lintrk = ((...args: unknown[]) => {
      lintrk.q?.push(args);
    }) as NonNullable<TrackerWindow['lintrk']>;
    lintrk.q = [];
    w.lintrk = lintrk;
  }
  appendScript(
    'linkedin',
    'https://snap.licdn.com/li.lms-analytics/insight.min.js',
  );
}

const TIKTOK_EVENTS_URL = 'https://analytics.tiktok.com/i18n/pixel/events.js';

/** TikTok Pixel base code (events.js) with its page view. */
function loadTiktok(id: string): void {
  const w = trackerWindow();
  w.TiktokAnalyticsObject = 'ttq';
  const ttq = (w.ttq ?? []) as TikTokQueue;
  w.ttq = ttq;
  ttq.methods = [
    'page',
    'track',
    'identify',
    'instances',
    'debug',
    'on',
    'off',
    'once',
    'ready',
    'alias',
    'group',
    'enableCookie',
    'disableCookie',
    'holdConsent',
    'revokeConsent',
    'grantConsent',
  ];
  ttq.setAndDefer = (target, method) => {
    (target as unknown as Record<string, Queue>)[method] = (
      ...args: unknown[]
    ) => {
      target.push([method, ...args]);
    };
  };
  for (const method of ttq.methods) ttq.setAndDefer(ttq, method);
  ttq._i = ttq._i ?? {};
  ttq._i[id] = Object.assign([], { _u: TIKTOK_EVENTS_URL });
  ttq._t = { ...(ttq._t ?? {}), [id]: Date.now() };
  ttq._o = { ...(ttq._o ?? {}), [id]: {} };
  ttq.page?.();
  appendScript(
    'tiktok',
    `${TIKTOK_EVENTS_URL}?sdkid=${encodeURIComponent(id)}&lib=ttq`,
  );
}

const LOADERS: Record<Tracker['kind'], (id: string) => void> = {
  ga4: loadGa4,
  meta: loadMeta,
  linkedin: loadLinkedin,
  tiktok: loadTiktok,
};

const loaded = new Set<Tracker['kind']>();

/**
 * Injects each enabled tracker once. Refuses without consent, so a caller that
 * forgets to ask cannot load anything.
 */
export function loadTrackers(trackers: Tracker[] = enabledTrackers()): void {
  if (typeof window === 'undefined' || !hasConsent()) return;
  for (const { kind, id } of trackers) {
    if (loaded.has(kind)) continue;
    LOADERS[kind](id);
    loaded.add(kind);
  }
}

/** Test seam: forget which trackers were loaded. */
export function resetLoadedTrackers(): void {
  loaded.clear();
}

function isActive(kind: Tracker['kind']): boolean {
  return (
    typeof window !== 'undefined' && hasConsent() && loaded.has(kind) === true
  );
}

export interface LeadEvent {
  score: number;
  temperature: string;
  budget: string;
}

/** The qualification chat finished and the lead was sent. */
export function trackLead({ score, temperature, budget }: LeadEvent): void {
  const w = trackerWindow();
  const details = { lead_score: score, temperature, budget };

  if (isActive('meta')) w.fbq?.('track', 'Lead', details);
  if (isActive('ga4')) w.gtag?.('event', 'generate_lead', details);
  if (isActive('tiktok')) w.ttq?.track?.('SubmitForm', details);

  const conversionId = linkedinConversionId();
  if (isActive('linkedin') && conversionId) {
    w.lintrk?.('track', { conversion_id: Number(conversionId) });
  }
}

export type ContactChannel = 'whatsapp' | 'email';

/** A direct contact link was used. */
export function trackContact(channel: ContactChannel): void {
  const w = trackerWindow();

  if (isActive('meta')) w.fbq?.('track', 'Contact', { channel });
  if (isActive('ga4')) w.gtag?.('event', 'contact', { method: channel });
  if (isActive('tiktok')) w.ttq?.track?.('Contact', { channel });
}

/** `onClick` for every WhatsApp link: `<a onClick={onWhatsappClick} …>`. */
export function onWhatsappClick(): void {
  trackContact('whatsapp');
}
