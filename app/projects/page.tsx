import type { Metadata } from 'next';

import Cell from '@/components/Projects/Cell';
import Entry from '@/components/Projects/Entry';
import { SchemaGraph } from '@/components/Schema';
import PageWrapper from '@/components/Template/PageWrapper';
import { archive, shipped } from '@/data/projects';
import { createPageMetadata } from '@/lib/metadata';
import {
  breadcrumbNode,
  collectionPageNode,
  HOME_URL,
  SITE_URL,
} from '@/lib/schema';
import { AUTHOR_NAME } from '@/lib/utils';

const PROJECTS_URL = `${SITE_URL}/projects/`;

const PAGE_TITLE = 'Projetos';

/**
 * Built from the register itself, so the share text cannot claim a lineup the
 * page no longer has. Capped at three names to keep the description short
 * enough to survive a search result.
 */
const PROJECTS_DESCRIPTION = `Projetos de ${AUTHOR_NAME} — ${shipped
  .slice(0, 3)
  .map((project) => project.title)
  .join(', ')} — e trabalhos anteriores.`;

function projectCountLabel(count: number): string {
  return `${count} ${count === 1 ? 'projeto' : 'projetos'}`;
}

export const metadata: Metadata = createPageMetadata({
  title: PAGE_TITLE,
  description: PROJECTS_DESCRIPTION,
  path: '/projects/',
});

export default function ProjectsPage() {
  return (
    <PageWrapper>
      <SchemaGraph
        nodes={[
          collectionPageNode({
            url: PROJECTS_URL,
            name: PAGE_TITLE,
            description: PROJECTS_DESCRIPTION,
            hasBreadcrumb: true,
          }),
          breadcrumbNode(PROJECTS_URL, [
            { name: 'Início', url: HOME_URL },
            { name: PAGE_TITLE, url: PROJECTS_URL },
          ]),
        ]}
      />
      <div className="projects-page">
        <header className="projects-header">
          <h1 className="page-title">{PAGE_TITLE}</h1>
          <p className="page-subtitle">
            Projetos open source que mantenho e trabalhos anteriores.
            {/* TODO(fabio): estudos de caso de projetos de clientes. */}
          </p>
        </header>

        <section className="projects-group" aria-labelledby="projects-selected">
          <div className="projects-group-header">
            <h2 id="projects-selected" className="projects-section-title">
              Em destaque
            </h2>
            {/* Counted, never typed. */}
            <span className="projects-section-count">
              {projectCountLabel(shipped.length)}
            </span>
          </div>
          <ol className="projects-register">
            {shipped.map((project) => (
              <li key={project.title}>
                <Entry data={project} />
              </li>
            ))}
          </ol>
        </section>

        <section className="projects-group" aria-labelledby="projects-archive">
          <div className="projects-group-header">
            <h2 id="projects-archive" className="projects-section-title">
              Anteriores
            </h2>
            <span className="projects-section-count">
              {projectCountLabel(archive.length)}
            </span>
          </div>
          <p className="projects-group-note">
            Projetos e experimentos anteriores, mantidos como registro.
          </p>
          <ol className="projects-grid">
            {archive.map((project) => (
              <li key={project.title}>
                <Cell data={project} />
              </li>
            ))}
          </ol>
        </section>
      </div>
    </PageWrapper>
  );
}
