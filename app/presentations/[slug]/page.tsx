import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import ContactIcons from '@/components/Contact/ContactIcons';
import QuoteCta from '@/components/Contact/QuoteCta';
import { SchemaGraph } from '@/components/Schema';
import PageWrapper from '@/components/Template/PageWrapper';
import presentations, { presentationPath } from '@/data/presentations';
import { createPageMetadata } from '@/lib/metadata';
import {
  breadcrumbNode,
  HOME_URL,
  SITE_URL,
  talkEventNode,
  webPageNode,
} from '@/lib/schema';
import { formatDate } from '@/lib/utils';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Talk URLs are printed on slides as QR codes: only known slugs exist.
export const dynamicParams = false;

export function generateStaticParams() {
  return presentations.map((talk) => ({ slug: talk.slug }));
}

function findTalk(slug: string) {
  return presentations.find((talk) => talk.slug === slug);
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const talk = findTalk(slug);

  if (!talk) return { title: 'Palestra não encontrada' };

  return createPageMetadata({
    title: talk.title,
    description: `Palestra no ${talk.event} (${talk.venue}). ${talk.description}`,
    path: presentationPath(talk) as `/${string}`,
  });
}

export default async function PresentationPage({ params }: PageProps) {
  const { slug } = await params;
  const talk = findTalk(slug);

  if (!talk) notFound();

  const pageUrl = `${SITE_URL}${presentationPath(talk)}`;
  const listUrl = `${SITE_URL}/presentations/`;

  return (
    <PageWrapper>
      <SchemaGraph
        nodes={[
          webPageNode({
            url: pageUrl,
            name: talk.title,
            description: talk.description,
            hasBreadcrumb: true,
          }),
          talkEventNode({
            url: pageUrl,
            name: talk.title,
            description: talk.description,
            date: talk.date,
            event: talk.event,
            venue: talk.venue,
            city: talk.city,
            ...(talk.slidesPdf
              ? { slidesUrl: `${SITE_URL}${talk.slidesPdf}` }
              : {}),
          }),
          breadcrumbNode(pageUrl, [
            { name: 'Início', url: HOME_URL },
            { name: 'Palestras', url: listUrl },
            { name: talk.title, url: pageUrl },
          ]),
        ]}
      />
      <article className="talk-page">
        <header className="talk-header">
          <p className="talk-kicker">
            <Link href="/presentations/">Palestras</Link>
          </p>
          <h1 className="page-title">{talk.title}</h1>
          <dl className="talk-facts">
            <div>
              <dt>Evento</dt>
              <dd>{talk.event}</dd>
            </div>
            <div>
              <dt>Local</dt>
              <dd>
                {talk.venue}, {talk.city}
              </dd>
            </div>
            <div>
              <dt>Data</dt>
              <dd>
                <time dateTime={talk.date}>{formatDate(talk.date)}</time>
              </dd>
            </div>
          </dl>
        </header>

        <div className="talk-summary">
          {talk.summary.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <div className="talk-materials">
          {talk.slidesPdf ? (
            <a href={talk.slidesPdf} className="button">
              Ver os slides (PDF)
            </a>
          ) : null}
          {talk.postSlug ? (
            <Link
              href={`/writing/${talk.postSlug}/`}
              className="button button-secondary"
            >
              Ler o resumo
            </Link>
          ) : null}
        </div>

        <section className="talk-contact" aria-labelledby="talk-contact-title">
          <h2 id="talk-contact-title" className="talk-section-title">
            Contatos
          </h2>
          <ContactIcons />
        </section>

        <QuoteCta />
      </article>
    </PageWrapper>
  );
}
