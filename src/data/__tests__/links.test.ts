import { describe, expect, it } from 'vitest';

import { SITE_URL } from '@/lib/utils';

import contact, {
  THREADS_URL,
  WHATSAPP_GREETING,
  WHATSAPP_NUMBER,
  whatsappLink,
} from '../contact';
import { BIO_SOURCES, bioUrl, LINKS_PATH, linkButtons } from '../links';

describe('bio links', () => {
  it('builds one UTM-tagged bio URL per network', () => {
    expect(bioUrl('instagram', SITE_URL)).toBe(
      'https://fabioassuncao.com/links/?utm_source=instagram&utm_medium=bio',
    );

    for (const source of BIO_SOURCES) {
      const url = new URL(bioUrl(source, SITE_URL));
      expect(url.origin).toBe('https://fabioassuncao.com');
      expect(url.pathname).toBe(LINKS_PATH);
      expect(url.searchParams.get('utm_source')).toBe(source);
      expect(url.searchParams.get('utm_medium')).toBe('bio');
    }
  });

  it('covers every network the bio page is shared from', () => {
    expect([...BIO_SOURCES].sort()).toEqual(
      [
        'github',
        'instagram',
        'linkedin',
        'threads',
        'tiktok',
        'x',
        'youtube',
      ].sort(),
    );
  });
});

describe('whatsappLink', () => {
  it('uses wa.me with the public number and an encoded greeting', () => {
    const url = new URL(whatsappLink());

    expect(`${url.origin}${url.pathname}`).toBe(
      `https://wa.me/${WHATSAPP_NUMBER}`,
    );
    expect(WHATSAPP_NUMBER).toBe('5598985643922');
    expect(url.searchParams.get('text')).toBe(WHATSAPP_GREETING);
  });

  it('encodes arbitrary text rather than splicing it into the URL', () => {
    const link = whatsappLink('Olá & até já? #1');

    expect(link).toBe(
      `https://wa.me/5598985643922?text=${encodeURIComponent('Olá & até já? #1')}`,
    );
    expect(new URL(link).searchParams.get('text')).toBe('Olá & até já? #1');
  });
});

describe('linkButtons', () => {
  it('leads with WhatsApp and the quote request as the filled actions', () => {
    const [first, second] = linkButtons();

    expect(first).toMatchObject({
      id: 'whatsapp',
      primary: true,
      external: true,
    });
    expect(first.href).toBe(whatsappLink());
    expect(second).toMatchObject({
      id: 'orcamento',
      href: '/trabalhe-comigo/#orcamento',
      primary: true,
      external: false,
    });
    expect(linkButtons().filter((button) => button.primary)).toHaveLength(2);
  });

  it('lists the social networks in order and skips unconfirmed ones', () => {
    const ids = linkButtons()
      .slice(2)
      .map((button) => button.id);

    expect(THREADS_URL).toBe('');
    expect(ids).toEqual([
      'youtube',
      'instagram',
      'tiktok',
      'linkedin',
      'github',
      'x',
    ]);
    for (const button of linkButtons().slice(2)) {
      expect(button.external).toBe(true);
      expect(button.href).toBe(
        contact.find((item) => item.id === button.id)?.link,
      );
    }
  });
});
