import { profileLinks } from '@/data/contact';
import profile from '@/data/profile.json';
import degrees from '@/data/resume/degrees';
import work from '@/data/resume/work';
import { currentPosition } from '@/lib/career';
import type { Post } from '@/lib/posts';
import {
  AUTHOR_NAME,
  SHARE_IMAGE_DIMENSIONS,
  SHARE_IMAGE_PATH,
  SITE_DESCRIPTION,
  SITE_IMAGE_DIMENSIONS,
  SITE_IMAGE_PATH,
  SITE_URL,
} from '@/lib/utils';

export { SITE_URL } from '@/lib/utils';

/**
 * Centralised JSON-LD (schema.org) graph builders.
 *
 * Every node carries a stable `@id` so crawlers can merge the same entity
 * across pages (e.g. the homepage Person and a blog post's author resolve to
 * one knowledge-graph node). Pages compose these builders into a single
 * `@graph` document via {@link buildGraph}.
 */

// Stable node identifiers, referenced across pages.
export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const BLOG_ID = `${SITE_URL}/writing/#blog`;

export const SITE_LANGUAGE = 'pt-BR';
export const SITE_IMAGE = `${SITE_URL}${SITE_IMAGE_PATH}`;
export const HOME_URL = `${SITE_URL}/`;

// Shared so the /writing metadata and the Blog node stay in sync.
export const WRITING_DESCRIPTION =
  'Artigos sobre engenharia de software, arquitetura, cloud e o papel do desenvolvedor na era da IA.';

/**
 * Topics the person is known for, for the JSON-LD `knowsAbout` property. Kept
 * to what the about page, résumé, and talks actually cover.
 */
export const KNOWS_ABOUT = [
  'Inteligência artificial aplicada a negócios e ao desenvolvimento de software',
  'Segurança de software',
  'Desenvolvimento de software',
  'Arquitetura de software',
  'Modernização de sistemas legados',
  'Cloud computing',
  'DevOps',
  'Liderança técnica',
  'PHP',
  'Node.js',
] as const;

type SchemaNode = Record<string, unknown>;

interface Crumb {
  name: string;
  url: string;
}

/** Reference to the canonical Person node. */
export const personRef = () => ({ '@id': PERSON_ID });

/** Reference to the canonical WebSite node. */
export const websiteRef = () => ({ '@id': WEBSITE_ID });

/** Reference to the canonical Blog node. */
export const blogRef = () => ({ '@id': BLOG_ID });

/**
 * The canonical Person entity. Emitted site-wide so every page anchors to the
 * same node; other nodes reference it via {@link personRef} instead of
 * repeating its properties.
 */
export function personNode(): SchemaNode {
  const socialLinks = profileLinks.map((item) => item.link);
  const email = profile.email;

  const currentJob = currentPosition(work);

  const [givenName, ...familyParts] = AUTHOR_NAME.split(' ');
  const familyName = familyParts.join(' ');

  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: AUTHOR_NAME,
    givenName,
    familyName,
    url: HOME_URL,
    image: {
      '@type': 'ImageObject',
      '@id': `${SITE_URL}/#person-image`,
      url: SITE_IMAGE,
      width: SITE_IMAGE_DIMENSIONS.width,
      height: SITE_IMAGE_DIMENSIONS.height,
      caption: AUTHOR_NAME,
    },
    description: SITE_DESCRIPTION,
    jobTitle: profile.role,
    ...(email && { email }),
    knowsAbout: [...KNOWS_ABOUT],
    sameAs: socialLinks,
    address: { '@type': 'PostalAddress', addressCountry: 'BR' },
    // Only an employer the data actually names is published.
    ...(currentJob?.name && {
      worksFor: {
        '@type': 'Organization',
        name: currentJob.name,
        ...(currentJob.url ? { url: currentJob.url } : {}),
      },
    }),
    ...(degrees.some((degree) => degree.school) && {
      alumniOf: degrees
        .filter((degree) => degree.school)
        .map((degree) => ({
          '@type': 'CollegeOrUniversity',
          name: degree.school,
          ...(degree.link ? { url: degree.link } : {}),
        })),
    }),
  };
}

/**
 * The canonical WebSite entity. Tells crawlers how to name the site in search
 * results. Emitted site-wide alongside {@link personNode}.
 */
export function websiteNode(): SchemaNode {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: HOME_URL,
    name: AUTHOR_NAME,
    alternateName: ['fabioassuncao.com', 'fabioassuncaohq'],
    description: SITE_DESCRIPTION,
    inLanguage: SITE_LANGUAGE,
    publisher: personRef(),
    image: {
      '@type': 'ImageObject',
      '@id': `${SITE_URL}/#website-image`,
      url: SITE_IMAGE,
      width: SITE_IMAGE_DIMENSIONS.width,
      height: SITE_IMAGE_DIMENSIONS.height,
      caption: AUTHOR_NAME,
    },
  };
}

/**
 * A BreadcrumbList for a page. `crumbs` should describe the categorisation path
 * ending at the current page. The node id is anchored to the page url.
 */
export function breadcrumbNode(pageUrl: string, crumbs: Crumb[]): SchemaNode {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${pageUrl}#breadcrumb`,
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

interface PageNodeOptions {
  url: string;
  name: string;
  description?: string;
  /** Attaches a `breadcrumb` reference (the BreadcrumbList must also be emitted). */
  hasBreadcrumb?: boolean;
}

export interface ArticleImage {
  url: string;
  width: number;
  height: number;
  alt?: string;
}

function baseWebPage(
  type: string,
  { url, name, description, hasBreadcrumb }: PageNodeOptions,
): SchemaNode {
  return {
    '@type': type,
    '@id': `${url}#webpage`,
    url,
    name,
    isPartOf: websiteRef(),
    inLanguage: SITE_LANGUAGE,
    ...(description ? { description } : {}),
    ...(hasBreadcrumb ? { breadcrumb: { '@id': `${url}#breadcrumb` } } : {}),
  };
}

/** A WebPage subtype describing a page about a person (e.g. home, about). */
export function profilePageNode(options: PageNodeOptions): SchemaNode {
  return {
    ...baseWebPage('ProfilePage', options),
    mainEntity: personRef(),
  };
}

/** A WebPage subtype for pages that primarily list things (e.g. writing, archive). */
export function collectionPageNode(options: PageNodeOptions): SchemaNode {
  return {
    ...baseWebPage('CollectionPage', options),
    about: personRef(),
  };
}

/** A plain WebPage, used for individual article pages. */
export function webPageNode(options: PageNodeOptions): SchemaNode {
  return baseWebPage('WebPage', options);
}

/**
 * The Blog node — a stepping stone between the WebSite and individual posts.
 * Belongs on the blog index page.
 */
export function blogNode(dateModified?: string): SchemaNode {
  return {
    '@type': 'Blog',
    '@id': BLOG_ID,
    isPartOf: websiteRef(),
    mainEntityOfPage: { '@id': `${SITE_URL}/writing/#webpage` },
    name: `Artigos de ${AUTHOR_NAME}`,
    description: WRITING_DESCRIPTION,
    inLanguage: SITE_LANGUAGE,
    ...(dateModified ? { dateModified } : {}),
    publisher: personRef(),
  };
}

/** A BlogPosting for an individual post. */
export function blogPostingNode(
  post: Post,
  articleImage?: ArticleImage,
): SchemaNode {
  const url = `${SITE_URL}/writing/${post.slug}/`;
  const image = articleImage ?? {
    url: `${SITE_URL}${SHARE_IMAGE_PATH}`,
    width: SHARE_IMAGE_DIMENSIONS.width,
    height: SHARE_IMAGE_DIMENSIONS.height,
  };

  return {
    '@type': 'BlogPosting',
    '@id': `${url}#blogposting`,
    url,
    mainEntityOfPage: { '@id': `${url}#webpage` },
    isPartOf: blogRef(),
    headline: post.title,
    description: post.description,
    inLanguage: SITE_LANGUAGE,
    datePublished: post.date,
    dateModified: post.date,
    author: personRef(),
    publisher: personRef(),
    image: {
      '@type': 'ImageObject',
      '@id': `${url}#blogposting-image`,
      url: image.url,
      width: image.width,
      height: image.height,
      ...(image.alt ? { caption: image.alt } : {}),
    },
  };
}

/** Wraps nodes into a single `@graph` JSON-LD document. */
export function buildGraph(nodes: SchemaNode[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes,
  };
}

interface TalkNodeOptions {
  url: string;
  name: string;
  description: string;
  date: string;
  event: string;
  venue: string;
  city: string;
  slidesUrl?: string;
}

/**
 * A talk, as an Event the person performed at. The slides, when published,
 * are attached as the event's `workPerformed` document.
 */
export function talkEventNode({
  url,
  name,
  description,
  date,
  event,
  venue,
  city,
  slidesUrl,
}: TalkNodeOptions): SchemaNode {
  return {
    '@type': 'Event',
    '@id': `${url}#event`,
    url,
    name,
    description,
    startDate: date,
    inLanguage: SITE_LANGUAGE,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    superEvent: { '@type': 'Event', name: event },
    location: {
      '@type': 'Place',
      name: venue,
      address: {
        '@type': 'PostalAddress',
        addressLocality: city,
        addressCountry: 'BR',
      },
    },
    performer: personRef(),
    organizer: { '@type': 'Organization', name: event },
    ...(slidesUrl
      ? {
          workPerformed: {
            '@type': 'PresentationDigitalDocument',
            name,
            url: slidesUrl,
            author: personRef(),
            inLanguage: SITE_LANGUAGE,
            encodingFormat: 'application/pdf',
          },
        }
      : {}),
  };
}
