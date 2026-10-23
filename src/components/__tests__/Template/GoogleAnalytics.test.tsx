import { isValidElement, type ReactElement } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import GoogleAnalytics from '../../Template/GoogleAnalytics';

type ScriptProps = { src?: string; id?: string; children?: string };

/** The fragment's children, read directly: next/script renders nothing here. */
function scriptsOf(element: ReturnType<typeof GoogleAnalytics>) {
  expect(isValidElement(element)).toBe(true);
  const children = (element as ReactElement<{ children: ReactElement[] }>).props
    .children;
  return children.map((child) => child.props as ScriptProps);
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('GoogleAnalytics', () => {
  it('renders nothing without a measurement ID', () => {
    vi.stubEnv('NEXT_PUBLIC_GA_TRACKING_ID', '');
    expect(GoogleAnalytics()).toBeNull();
  });

  it('refuses an ID that is not a GA4 measurement ID', () => {
    vi.stubEnv('NEXT_PUBLIC_GA_TRACKING_ID', "G-1');alert(1);('");
    expect(GoogleAnalytics()).toBeNull();
  });

  it('loads gtag and configures the ID when one is set', () => {
    vi.stubEnv('NEXT_PUBLIC_GA_TRACKING_ID', 'G-ABC123');
    const [loader, init] = scriptsOf(GoogleAnalytics());

    expect(loader.src).toBe(
      'https://www.googletagmanager.com/gtag/js?id=G-ABC123',
    );
    expect(init.id).toBe('ga-init');
    expect(init.children).toContain("gtag('config','G-ABC123')");
  });
});
