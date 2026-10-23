import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { SchemaGraph } from '@/components/Schema';
import Hero from '@/components/Template/Hero';
import PageWrapper from '@/components/Template/PageWrapper';
import { presentationPath, sortedPresentations } from '@/data/presentations';
import { shipped } from '@/data/projects';
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

  const highlights: HomeItem[] = shipped.slice(0, 3).map((project) => ({
    href: project.link ?? '/projects/',
    meta: project.subtitle ?? 'Projeto',
    title: project.title,
    description: project.desc,
    external: Boolean(project.link),
  }));

  return (
    <PageWrapper mainClassName="page-main--hero">
      <SchemaGraph
        nodes={[profilePageNode({ url: HOME_URL, name: AUTHOR_NAME })]}
      />
      <Hero />
      <HomeSection
        id="home-writing-title"
        title="Artigos recentes"
        allHref="/writing/"
        allLabel="Todos os artigos"
        items={recentWriting}
      />
      <HomeSection
        id="home-talks-title"
        title="Palestras"
        allHref="/presentations/"
        allLabel="Todas as palestras"
        items={talks}
      />
      <HomeSection
        id="home-projects-title"
        title="Projetos em destaque"
        allHref="/projects/"
        allLabel="Todos os projetos"
        items={highlights}
      />
    </PageWrapper>
  );
}
