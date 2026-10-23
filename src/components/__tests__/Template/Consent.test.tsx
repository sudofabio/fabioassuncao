import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import Consent, { PRIVACY_PATH } from '@/components/Template/Consent';
import { resetLoadedTrackers } from '@/lib/analytics';
import { CONSENT_KEY, resetSessionConsent } from '@/lib/trackers';

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
  vi.restoreAllMocks();
  for (const script of document.querySelectorAll('script[data-tracker]')) {
    script.remove();
  }
});

function enableMetaAndTiktok() {
  vi.stubEnv('NEXT_PUBLIC_META_PIXEL_ID', '123456789012345');
  vi.stubEnv('NEXT_PUBLIC_TIKTOK_PIXEL_ID', 'C4ABCDEFGHIJKLMNOPQR');
}

describe('Consent', () => {
  it('renders nothing when no tracker is configured', () => {
    const { container } = render(<Consent />);
    expect(container).toBeEmptyDOMElement();
  });

  it('asks before loading anything, with a link to the privacy policy', () => {
    enableMetaAndTiktok();
    render(<Consent />);

    expect(
      screen.getByRole('region', { name: 'Medição com o seu consentimento' }),
    ).toBeInTheDocument();
    // trailingSlash is a build-time setting jsdom never applies.
    expect(
      screen
        .getByRole('link', { name: 'política de privacidade' })
        .getAttribute('href')
        ?.replace(/\/?$/, '/'),
    ).toBe(PRIVACY_PATH);
    expect(trackerScripts()).toEqual([]);
  });

  it('loads only the enabled trackers after "Aceitar" and remembers it', () => {
    enableMetaAndTiktok();
    render(<Consent />);

    fireEvent.click(screen.getByRole('button', { name: 'Aceitar' }));

    expect(trackerScripts()).toEqual(['meta', 'tiktok']);
    expect(window.localStorage.getItem(CONSENT_KEY)).toBe('granted');
    expect(screen.queryByRole('region')).not.toBeInTheDocument();
  });

  it('loads nothing after "Recusar" and remembers it', () => {
    enableMetaAndTiktok();
    render(<Consent />);

    fireEvent.click(screen.getByRole('button', { name: 'Recusar' }));

    expect(trackerScripts()).toEqual([]);
    expect(window.localStorage.getItem(CONSENT_KEY)).toBe('denied');
    expect(screen.queryByRole('region')).not.toBeInTheDocument();
  });

  it('does not ask again and loads on mount when consent was given before', () => {
    enableMetaAndTiktok();
    window.localStorage.setItem(CONSENT_KEY, 'granted');

    render(<Consent />);

    expect(screen.queryByRole('region')).not.toBeInTheDocument();
    expect(trackerScripts()).toEqual(['meta', 'tiktok']);
  });

  it('stays silent after an earlier refusal', () => {
    enableMetaAndTiktok();
    window.localStorage.setItem(CONSENT_KEY, 'denied');

    render(<Consent />);

    expect(screen.queryByRole('region')).not.toBeInTheDocument();
    expect(trackerScripts()).toEqual([]);
  });

  it('still works when storage throws', () => {
    enableMetaAndTiktok();
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });

    render(<Consent />);
    fireEvent.click(screen.getByRole('button', { name: 'Aceitar' }));

    expect(trackerScripts()).toEqual(['meta', 'tiktok']);
  });

  it('hands focus to the main content when the banner closes', () => {
    enableMetaAndTiktok();
    const main = document.createElement('main');
    main.id = 'main-content';
    main.tabIndex = -1;
    document.body.appendChild(main);

    render(<Consent />);
    const accept = screen.getByRole('button', { name: 'Aceitar' });
    accept.focus();
    fireEvent.click(accept);

    expect(document.activeElement).toBe(main);
    main.remove();
  });
});
