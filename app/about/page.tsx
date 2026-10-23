import type { Metadata } from 'next';

import AboutContent from '@/components/About/Sections';
import { SchemaGraph } from '@/components/Schema';
import PageWrapper from '@/components/Template/PageWrapper';
import { aboutMarkdown } from '@/data/about';
import profile from '@/data/profile.json';
import { createPageMetadata } from '@/lib/metadata';
import {
  breadcrumbNode,
  HOME_URL,
  profilePageNode,
  SITE_URL,
} from '@/lib/schema';
import { AUTHOR_NAME } from '@/lib/utils';

const ABOUT_URL = `${SITE_URL}/about/`;

const ABOUT_DESCRIPTION = `Conheça ${AUTHOR_NAME}: ${profile.role.toLowerCase()} com mais de 15 anos de experiência em backend, arquitetura de sistemas e cloud computing.`;

export const metadata: Metadata = createPageMetadata({
  title: 'Sobre',
  description: ABOUT_DESCRIPTION,
  path: '/about/',
});

export default function AboutPage() {
  return (
    <PageWrapper>
      <SchemaGraph
        nodes={[
          profilePageNode({
            url: ABOUT_URL,
            name: 'Sobre',
            description: ABOUT_DESCRIPTION,
            hasBreadcrumb: true,
          }),
          breadcrumbNode(ABOUT_URL, [
            { name: 'Início', url: HOME_URL },
            { name: 'Sobre', url: ABOUT_URL },
          ]),
        ]}
      />
      <section className="about-page">
        <header className="about-header">
          <h1 className="page-title">Sobre</h1>
        </header>
        <AboutContent markdown={aboutMarkdown} />
      </section>
    </PageWrapper>
  );
}
