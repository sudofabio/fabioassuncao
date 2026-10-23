import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';

import Pillars from '@/components/Home/Pillars';
import { SchemaGraph } from '@/components/Schema';
import ServiceGroups from '@/components/Services/ServiceGroups';
import Hero from '@/components/Template/Hero';
import PageWrapper from '@/components/Template/PageWrapper';
import { presentationPath, sortedPresentations } from '@/data/presentations';
import { HOME_URL, profilePageNode } from '@/lib/schema';
import {
  AUTHOR_NAME,
  formatDate,
  SITE_DESCRIPTION,
  SITE_URL,
} from '@/lib/utils';
import { getWritingItems } from '@/lib/writing';

export const metadata: Metadata = {
  description: SITE_DESCRIPTION,
  // The homepage builds its openGraph in the root layout, so it only needs
  // the canonical here. `trailingSlash: true` makes `/` the canonical form.
  alternates: { canonical: `${SITE_URL}/` },
};

interface HomeItem {
  href: string;
  meta: string;
  title: string;
  description?: string;
  external?: boolean;
}

/** One titled register under the hero: latest writing, talks, or work. */
function HomeSection({
  id,
  title,
  allHref,
  allLabel,
  items,
}: {
  id: string;
  title: string;
  allHref: string;
  allLabel: string;
  items: HomeItem[];
}) {
  if (items.length === 0) return null;

  return (
    <section className="home-writing" aria-labelledby={id}>
      <div className="home-writing-header">
        <h2 id={id}>{title}</h2>
        <Link href={allHref} className="home-writing-all">
          {allLabel} <span aria-hidden="true">↗</span>
        </Link>
      </div>
      <div className="home-writing-list">
        {items.map((item) => {
          const content: ReactNode = (
            <>
              <span className="home-writing-meta">{item.meta}</span>
              <div className="home-writing-copy">
                <h3>{item.title}</h3>
                {item.description ? (
                  <p className="home-writing-description">{item.description}</p>
                ) : null}
              </div>
              <span className="home-writing-arrow" aria-hidden="true">
                ↗
              </span>
            </>
          );

          return item.external ? (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="home-writing-item"
            >
              {content}
              <span className="sr-only"> (abre em nova aba)</span>
            </a>
          ) : (
            <Link
              key={item.href}
              href={item.href}
              className="home-writing-item"
            >
              {content}
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default function HomePage() {
  const recentWriting: HomeItem[] = getWritingItems()
    .filter((item) => item.date)
    .slice(0, 3)
    .map((item) => ({
      href: item.url,
      meta: `${formatDate(item.date)} · ${item.source}`,
      title: item.title,
      external: item.isExternal,
    }));

  const talks: HomeItem[] = sortedPresentations()
    .slice(0, 3)
    .map((talk) => ({
      href: presentationPath(talk),
      meta: `${formatDate(talk.date)} · ${talk.event}`,
      title: talk.title,
    }));

  return (
    <PageWrapper mainClassName="page-main--hero">
      <SchemaGraph
        nodes={[profilePageNode({ url: HOME_URL, name: AUTHOR_NAME })]}
      />
      <Hero />
      <Pillars />
      <section className="home-block" aria-labelledby="home-services-title">
        <header className="home-block-header">
          <p className="section-label">Trabalho</p>
          <h2 id="home-services-title">O que eu faço</h2>
          <p className="home-block-lede">
            Eu ajudo empresas a construir, modernizar e proteger sistemas, e a
            usar IA onde ela realmente faz diferença.
          </p>
        </header>
        <ServiceGroups compact />
        <div className="home-block-actions">
          <Link href="/contato/" className="button">
            Fale comigo
          </Link>
          <Link href="/trabalhe-comigo/" className="button button-secondary">
            Ver os detalhes
          </Link>
        </div>
      </section>
      <HomeSection
        id="home-talks-title"
        title="Palestras"
        allHref="/presentations/"
        allLabel="Todas as palestras"
        items={talks}
      />
      <HomeSection
        id="home-writing-title"
        title="Artigos recentes"
        allHref="/writing/"
        allLabel="Todos os artigos"
        items={recentWriting}
      />
    </PageWrapper>
  );
}
