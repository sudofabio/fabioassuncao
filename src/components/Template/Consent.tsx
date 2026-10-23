'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { loadTrackers } from '@/lib/analytics';
import {
  type ConsentChoice,
  enabledTrackers,
  readConsent,
  rememberConsent,
} from '@/lib/trackers';

import { MAIN_CONTENT_ID } from './PageWrapper';

export const PRIVACY_PATH = '/privacidade/';

/**
 * Consent for audience and advertising measurement.
 *
 * Renders nothing when no tracker is configured, and nothing until mounted, so
 * the static HTML never carries a banner that would flash for a visitor who
 * already chose. Non-modal: the page stays usable while it is open, and
 * nothing is measured unless "Aceitar" is pressed.
 */
export default function Consent() {
  const trackers = useMemo(() => enabledTrackers(), []);
  const [mounted, setMounted] = useState(false);
  const [choice, setChoice] = useState<ConsentChoice | null>(null);
  const bannerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (trackers.length === 0) return;
    const stored = readConsent();
    setChoice(stored);
    setMounted(true);
    if (stored === 'granted') loadTrackers(trackers);
  }, [trackers]);

  const decide = useCallback(
    (next: ConsentChoice) => {
      // Focus sits on the button that is about to disappear; hand it to the
      // main content so keyboard users are not dropped at the top of <body>.
      const hadFocus = bannerRef.current?.contains(document.activeElement);
      rememberConsent(next);
      setChoice(next);
      if (next === 'granted') loadTrackers(trackers);
      if (hadFocus) {
        document
          .getElementById(MAIN_CONTENT_ID)
          ?.focus({ preventScroll: true });
      }
    },
    [trackers],
  );

  if (!mounted || trackers.length === 0 || choice !== null) return null;

  return (
    <section
      ref={bannerRef}
      className="consent-banner"
      aria-labelledby="consent-title"
      aria-describedby="consent-text"
    >
      <h2 id="consent-title" className="consent-title">
        Medição com o seu consentimento
      </h2>
      <p id="consent-text" className="consent-text">
        Uso ferramentas de medição de audiência e de anúncios só se você
        permitir. Veja a{' '}
        <Link href={PRIVACY_PATH}>política de privacidade</Link>.
      </p>
      <div className="consent-actions">
        <button
          type="button"
          className="button"
          onClick={() => decide('granted')}
        >
          Aceitar
        </button>
        <button
          type="button"
          className="button button-secondary"
          onClick={() => decide('denied')}
        >
          Recusar
        </button>
      </div>
    </section>
  );
}
