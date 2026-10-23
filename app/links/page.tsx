import type { Metadata } from 'next';
import Link from 'next/link';

import PageWrapper from '@/components/Template/PageWrapper';
import ThemePortrait from '@/components/Template/ThemePortrait';
import { type LinkButton, linkButtons } from '@/data/links';
import profile from '@/data/profile.json';
import { createPageMetadata } from '@/lib/metadata';
import { getWritingItems } from '@/lib/writing';

export const metadata: Metadata = createPageMetadata({
  title: 'Links',
  description: `Links de ${profile.name}: WhatsApp, pedido de orçamento, redes sociais e o artigo mais recente.`,
  path: '/links/',
});

function LinkItem({ button }: { button: LinkButton }) {
  const className = `links-button${button.primary ? ' links-button--primary' : ''}`;

  if (!button.external) {
    return (
      <Link href={button.href} className={className}>
        {button.label}
      </Link>
    );
  }

  return (
    <a
      href={button.href}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
    >
      {button.label}
      <span className="sr-only"> (abre em nova aba)</span>
    </a>
  );
}

/**
 * The single destination of every social bio. Kept to one screen of large
 * tap targets: it is opened inside Instagram's or TikTok's in-app browser,
 * almost always on a phone.
 */
export default function LinksPage() {
  const latest = getWritingItems().find((item) => item.date);
  const buttons: LinkButton[] = [
    ...linkButtons(),
    ...(latest
      ? [
          {
            id: 'latest-post',
            label: `Último artigo: ${latest.title}`,
            href: latest.url,
            external: latest.isExternal,
          },
        ]
      : []),
  ];

  return (
    <PageWrapper hideFooter mainClassName="page-main--links">
      <section className="links-page" aria-labelledby="links-name">
        <header className="links-header">
          <span className="links-avatar">
            <ThemePortrait width={96} height={96} priority />
          </span>
          <h1 id="links-name" className="links-name">
            {profile.name}
          </h1>
          <p className="links-bio">
            Desenvolvedor de software e Tech Lead · backend, arquitetura e
            cloud.
          </p>
        </header>
        <ul className="links-list">
          {buttons.map((button) => (
            <li key={button.id}>
              <LinkItem button={button} />
            </li>
          ))}
        </ul>
        <p className="links-footer">
          <Link href="/">fabioassuncao.com</Link>
        </p>
      </section>
    </PageWrapper>
  );
}
