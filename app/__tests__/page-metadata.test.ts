import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';

import profile from '@/data/profile.json';
import { sharedOpenGraph } from '@/lib/metadata';
import { getPostBySlug, getPostSlugs } from '@/lib/posts';
import { RESUME_JSON_URL } from '@/lib/resumeJson';
import {
  AUTHOR_NAME,
  SHARE_IMAGE_DIMENSIONS,
  SHARE_IMAGE_PATH,
  SITE_TITLE,
  SITE_URL,
  TWITTER_HANDLE,
} from '@/lib/utils';
import { metadata as aboutMetadata } from '../about/page';
import { metadata as contactMetadata } from '../contato/page';
import { metadata as rootMetadata } from '../layout';
import { metadata as notFoundMetadata } from '../not-found';
import { generateMetadata as generateTalkMetadata } from '../presentations/[slug]/page';
import { metadata as presentationsMetadata } from '../presentations/page';
import { metadata as privacyMetadata } from '../privacidade/page';
import { metadata as projectsMetadata } from '../projects/page';
import { metadata as resumeMetadata } from '../resume/page';
import { metadata as workWithMeMetadata } from '../trabalhe-comigo/page';
import { generateMetadata as generatePostMetadata } from '../writing/[slug]/page';
import { metadata as writingMetadata } from '../writing/page';

// `next/font/local` only exists as a build-time transform; the root layout
// is imported for its metadata, so the font loader is stubbed (hoisted).
vi.mock('next/font/local', () => ({
  default: () => ({ variable: 'font-mock', className: 'font-mock', style: {} }),
}));

const TALK_SLUG =
  'alem-do-codigo-inteligencia-artificial-e-o-novo-desenvolvedor';
const talkMetadata = () =>
  generateTalkMetadata({ params: Promise.resolve({ slug: TALK_SLUG }) });

/** Every page with a stable URL, and the canonical it must declare. */
const PAGES = [
  ['about', aboutMetadata, `${SITE_URL}/about/`],
  ['contato', contactMetadata, `${SITE_URL}/contato/`],
  ['archive', projectsMetadata, `${SITE_URL}/projects/`],
  ['resume', resumeMetadata, `${SITE_URL}/resume/`],
  ['writing', writingMetadata, `${SITE_URL}/writing/`],
  ['privacidade', privacyMetadata, `${SITE_URL}/privacidade/`],
  ['trabalhe-comigo', workWithMeMetadata, `${SITE_URL}/trabalhe-comigo/`],
  ['presentations', presentationsMetadata, `${SITE_URL}/presentations/`],
] as const;

const PAGES_WITHOUT_URL = PAGES.map(
  ([name, metadata]) => [name, metadata] as const,
);

describe('page metadata', () => {
  it('names the contact page after the chat and the shared profile', () => {
    expect(contactMetadata.title).toBe('Fale comigo');
    expect(contactMetadata.description).toContain(profile.name);
  });

  it('names the services page "O que eu faço"', () => {
    expect(workWithMeMetadata.title).toBe('O que eu faço');
  });

  it('uses the approved default title and template at the root', () => {
    expect(SITE_TITLE).toBe(
      'Fábio Assunção | Engenheiro de Software · IA, Desenvolvimento e Segurança',
    );
    expect(rootMetadata.title).toEqual({
      default: SITE_TITLE,
      template: `%s | ${AUTHOR_NAME}`,
    });
    expect(rootMetadata.openGraph?.title).toBe(SITE_TITLE);
    expect(rootMetadata.twitter?.title).toBe(SITE_TITLE);
  });

  it.each(PAGES)(
    'sets page-specific open graph metadata for %s',
    (_, metadata, url) => {
      expect(metadata.openGraph?.url).toBe(url);
      expect(metadata.openGraph?.description).toBe(metadata.description);
      expect(metadata.openGraph?.title).toBe(
        `${metadata.title} | ${AUTHOR_NAME}`,
      );
    },
  );

  it.each(PAGES_WITHOUT_URL)(
    'sets page-specific twitter metadata for %s',
    (_, metadata) => {
      expect(metadata.twitter?.description).toBe(metadata.description);
      expect(metadata.twitter?.title).toBe(
        `${metadata.title} | ${AUTHOR_NAME}`,
      );
    },
  );

  /**
   * A route-level `openGraph` object replaces the inherited one entirely, so
   * every page that declares one must repeat the share image. Blog posts
   * shipped without an og:image for exactly this reason.
   */
  it.each([...PAGES_WITHOUT_URL, ['404', notFoundMetadata] as const])(
    'declares the share card on %s',
    (_, metadata) => {
      const ogImages = metadata.openGraph?.images;
      expect(JSON.stringify(ogImages)).toContain(SHARE_IMAGE_PATH);
      expect(JSON.stringify(metadata.twitter?.images)).toContain(
        SHARE_IMAGE_PATH,
      );
    },
  );

  /**
   * `alternates` carries the canonical, and like `openGraph` it is replaced
   * rather than merged — the writing index lost its canonical by declaring
   * RSS types on top of it.
   */
  it.each(PAGES)('declares a canonical url for %s', (_, metadata, url) => {
    expect(metadata.alternates?.canonical).toBe(url);
  });

  it('omits the canonical on 404, which has no stable url', () => {
    expect(notFoundMetadata.alternates?.canonical).toBeUndefined();
  });

  it('keeps the RSS alternate alongside the canonical on the writing index', () => {
    expect(writingMetadata.alternates?.types).toEqual({
      'application/rss+xml': '/feed.xml',
    });
  });

  it('advertises the JSON Resume alongside the resume canonical', () => {
    expect(resumeMetadata.alternates?.types).toEqual({
      'application/json': RESUME_JSON_URL,
    });
    expect(resumeMetadata.alternates?.canonical).toBe(`${SITE_URL}/resume/`);
  });

  it('declares a canonical url for blog posts', async () => {
    const [slug] = getPostSlugs();
    const metadata = await generatePostMetadata({
      params: Promise.resolve({ slug }),
    });

    expect(metadata.alternates?.canonical).toBe(`${SITE_URL}/writing/${slug}/`);
  });

  /**
   * Every post declares the card generated for it rather than the site card, so
   * a shared essay does not look byte-identical to a shared homepage. The path
   * is the convention `scripts/og-inputs.mjs` writes to, and the file has to
   * exist: `generateMetadata` measures it, so a missing card fails the build.
   * A post's own `image` is the article image for JSON-LD, not the share card,
   * because it is not the shape `summary_large_image` wants.
   */
  it.each(getPostSlugs())(
    'declares a share card of its own on %s',
    async (slug) => {
      const metadata = await generatePostMetadata({
        params: Promise.resolve({ slug }),
      });
      const post = getPostBySlug(slug);
      const card = `/og/writing/${slug}.png`;

      expect(existsSync(join(process.cwd(), 'public', card))).toBe(true);
      expect(metadata.openGraph?.images).toEqual([
        {
          url: `${SITE_URL}${card}`,
          width: SHARE_IMAGE_DIMENSIONS.width,
          height: SHARE_IMAGE_DIMENSIONS.height,
          alt: `${post?.title} — ${AUTHOR_NAME}`,
        },
      ]);
      expect(metadata.twitter?.images).toEqual(metadata.openGraph?.images);
      expect(JSON.stringify(metadata.openGraph?.images)).not.toContain(
        `${SITE_URL}${SHARE_IMAGE_PATH}`,
      );
    },
  );

  /**
   * The share blocks are spread, not rebuilt: a route-level `openGraph` or
   * `twitter` object replaces the inherited one, and posts have already shipped
   * twice missing something omitted here.
   */
  it('keeps the shared open graph and twitter fields on blog posts', async () => {
    const [slug] = getPostSlugs();
    const metadata = await generatePostMetadata({
      params: Promise.resolve({ slug }),
    });

    expect(metadata.openGraph?.siteName).toBe(sharedOpenGraph?.siteName);
    expect(metadata.openGraph).toMatchObject({ locale: 'pt_BR' });
    expect(metadata.twitter).toMatchObject({
      card: 'summary_large_image',
      site: TWITTER_HANDLE,
      creator: TWITTER_HANDLE,
    });
  });

  it('overrides 404 share metadata without inventing a canonical url', () => {
    expect(notFoundMetadata.openGraph?.url).toBeUndefined();
    expect(notFoundMetadata.openGraph?.description).toBe(
      notFoundMetadata.description,
    );
    expect(notFoundMetadata.openGraph?.title).toBe(
      `${notFoundMetadata.title} | ${AUTHOR_NAME}`,
    );
    expect(notFoundMetadata.twitter?.description).toBe(
      notFoundMetadata.description,
    );
    expect(notFoundMetadata.twitter?.title).toBe(
      `${notFoundMetadata.title} | ${AUTHOR_NAME}`,
    );
  });

  it('preserves the writing rss alternate', () => {
    expect(writingMetadata.alternates?.types?.['application/rss+xml']).toBe(
      '/feed.xml',
    );
  });

  it('gives the talk page the same complete share metadata', async () => {
    const metadata = await talkMetadata();
    const url = `${SITE_URL}/presentations/${TALK_SLUG}/`;

    expect(metadata.alternates?.canonical).toBe(url);
    expect(metadata.openGraph?.url).toBe(url);
    expect(metadata.openGraph?.description).toBe(metadata.description);
    expect(metadata.openGraph?.title).toBe(
      `${metadata.title} | ${AUTHOR_NAME}`,
    );
    expect(metadata.twitter?.description).toBe(metadata.description);
    expect(metadata.twitter?.title).toBe(`${metadata.title} | ${AUTHOR_NAME}`);
    expect(JSON.stringify(metadata.openGraph?.images)).toContain(
      SHARE_IMAGE_PATH,
    );
    expect(JSON.stringify(metadata.twitter?.images)).toContain(
      SHARE_IMAGE_PATH,
    );
  });

  it('describes the talk with its event and venue', async () => {
    const metadata = await talkMetadata();

    expect(metadata.title).toBe(
      'Além do código: Inteligência artificial e o novo desenvolvedor',
    );
    expect(metadata.description).toContain('10º Talk — Vale do Pindaré Tech');
    expect(metadata.description).toContain('IFMA Campus Santa Inês');
  });
});
