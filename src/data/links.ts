import contact, { type ContactId } from './contact';

/**
 * The one link every social bio points at, and the buttons it shows.
 *
 * Each network's bio uses `bioUrl(network)` so visits arrive tagged with
 * where they came from (`utm_source=<network>&utm_medium=bio`), without any
 * analytics script on the page itself.
 */
export const LINKS_PATH = '/links/';

/** Networks whose bio links to `/links/`, in the order they are reported. */
export const BIO_SOURCES = [
  'instagram',
  'tiktok',
  'youtube',
  'threads',
  'linkedin',
  'x',
  'github',
] as const;

export type BioSource = (typeof BIO_SOURCES)[number];

export function bioUrl(source: BioSource, siteUrl: string): string {
  const params = new URLSearchParams({ utm_source: source, utm_medium: 'bio' });
  return `${siteUrl}${LINKS_PATH}?${params.toString()}`;
}

export interface LinkButton {
  id: string;
  label: string;
  href: string;
  /** Opens off-site, so it gets a new tab and a spoken warning. */
  external: boolean;
  /** The one or two actions that matter most are drawn filled. */
  primary?: boolean;
}

/** Order of the social buttons, after the two conversion actions. */
const SOCIAL_ORDER: ContactId[] = [
  'youtube',
  'instagram',
  'tiktok',
  'threads',
  'linkedin',
  'github',
  'x',
];

function socialButton(id: ContactId): LinkButton | null {
  // `contact` already drops entries with no confirmed link (e.g. Threads).
  const item = contact.find((entry) => entry.id === id);
  if (!item) return null;

  return { id, label: item.label, href: item.link, external: true };
}

/** Buttons for `/links/`; the latest post is appended by the page. */
export function linkButtons(): LinkButton[] {
  const whatsapp = contact.find((entry) => entry.id === 'whatsapp');

  return [
    ...(whatsapp
      ? [
          {
            id: 'whatsapp',
            label: 'Conversar no WhatsApp',
            href: whatsapp.link,
            external: true,
            primary: true,
          },
        ]
      : []),
    {
      id: 'orcamento',
      label: 'Pedir orçamento',
      href: '/trabalhe-comigo/#orcamento',
      external: false,
      primary: true,
    },
    ...SOCIAL_ORDER.map(socialButton).filter(
      (button): button is LinkButton => button !== null,
    ),
  ];
}
