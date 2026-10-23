import type { Metadata } from 'next';
import Link from 'next/link';

import QuoteCta from '@/components/Contact/QuoteCta';
import { SchemaGraph } from '@/components/Schema';
import PageWrapper from '@/components/Template/PageWrapper';
import { presentationPath, sortedPresentations } from '@/data/presentations';
import { createPageMetadata } from '@/lib/metadata';
import {
  breadcrumbNode,
  collectionPageNode,
  HOME_URL,
  SITE_URL,
} from '@/lib/schema';
import { AUTHOR_NAME, formatDate } from '@/lib/utils';

const PRESENTATIONS_URL = `${SITE_URL}/presentations/`;
const PAGE_TITLE = 'Palestras';
const PRESENTATIONS_DESCRIPTION = `Palestras e apresentações de ${AUTHOR_NAME} sobre engenharia de software, inteligência artificial e cloud computing.`;

export const metadata: Metadata = createPageMetadata({
  title: PAGE_TITLE,
  description: PRESENTATIONS_DESCRIPTION,
  path: '/presentations/',
});

export default function PresentationsPage() {
  const talks = sortedPresentations();

  return (
    <PageWrapper>
      <SchemaGraph
        nodes={[
          collectionPageNode({
            url: PRESENTATIONS_URL,
            name: PAGE_TITLE,
            description: PRESENTATIONS_DESCRIPTION,
            hasBreadcrumb: true,
          }),
          breadcrumbNode(PRESENTATIONS_URL, [
            { name: 'Início', url: HOME_URL },
            { name: PAGE_TITLE, url: PRESENTATIONS_URL },
          ]),
        ]}
      />
      <section className="talks-page">
        <header className="talks-header">
          <h1 className="page-title">{PAGE_TITLE}</h1>
          <p className="page-subtitle">
            Palestras e apresentações técnicas, com material para consulta.
          </p>
        </header>

        <ol className="talks-list">
          {talks.map((talk) => (
            <li key={talk.slug}>
              <Link href={presentationPath(talk)} className="talk-item">
                <span className="talk-meta">
                  <time dateTime={talk.date}>{formatDate(talk.date)}</time> ·{' '}
                  {talk.event}
                </span>
                <span className="talk-title">{talk.title}</span>
                <span className="talk-description">{talk.description}</span>
              </Link>
            </li>
          ))}
        </ol>

        <QuoteCta
          title="Quer uma palestra no seu evento?"
          text="Falo sobre desenvolvimento de software, arquitetura, cloud e o papel do desenvolvedor na era da IA. Conte o formato e a data do evento."
        />
      </section>
    </PageWrapper>
  );
}
