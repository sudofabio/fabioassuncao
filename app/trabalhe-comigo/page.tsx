import type { Metadata } from 'next';
import Link from 'next/link';

import { SchemaGraph } from '@/components/Schema';
import ServiceGroups from '@/components/Services/ServiceGroups';
import PageWrapper from '@/components/Template/PageWrapper';
import { STANDARD } from '@/data/pillars';
import { createPageMetadata } from '@/lib/metadata';
import { breadcrumbNode, HOME_URL, SITE_URL, webPageNode } from '@/lib/schema';
import { AUTHOR_NAME } from '@/lib/utils';

const PAGE_URL = `${SITE_URL}/trabalhe-comigo/`;
const PAGE_TITLE = 'O que eu faço';
const PAGE_DESCRIPTION = `${AUTHOR_NAME} ajuda empresas a construir, modernizar e proteger sistemas, e a usar IA onde ela realmente faz diferença: desenvolvimento sob medida, segurança, IA, CTO sob demanda e mentoria.`;

export const metadata: Metadata = createPageMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: '/trabalhe-comigo/',
});

/** Situations a prospective client recognises before reading anything else. */
const PAINS = [
  'O sistema cresceu, ficou lento ou instável, e cada mudança parece arriscada.',
  'Saiu uma falha na notícia e você não sabe se o seu sistema está exposto.',
  'O app foi feito com IA, funciona, mas você não sabe se está seguro para cliente de verdade.',
  'Você quer usar IA no negócio sem trocar qualidade por velocidade, e sem cair no hype.',
  'Precisa de alguém experiente para revisar uma decisão antes de investir nela.',
];

export default function WorkWithMePage() {
  return (
    <PageWrapper>
      <SchemaGraph
        nodes={[
          webPageNode({
            url: PAGE_URL,
            name: PAGE_TITLE,
            description: PAGE_DESCRIPTION,
            hasBreadcrumb: true,
          }),
          breadcrumbNode(PAGE_URL, [
            { name: 'Início', url: HOME_URL },
            { name: PAGE_TITLE, url: PAGE_URL },
          ]),
        ]}
      />
      <article className="work-page">
        <header className="work-header">
          <p className="section-label">Trabalhe comigo</p>
          <h1 className="page-title">{PAGE_TITLE}</h1>
          <p className="page-subtitle">
            Eu ajudo empresas a construir, modernizar e proteger sistemas, e a
            usar IA onde ela realmente faz diferença.
          </p>
        </header>

        <section className="work-section" aria-labelledby="work-pains">
          <h2 id="work-pains" className="work-section-title">
            Isso é você?
          </h2>
          <ul className="work-pains">
            {PAINS.map((pain) => (
              <li key={pain}>{pain}</li>
            ))}
          </ul>
          <p className="work-note">
            Se alguma dessas frases soou familiar, vale uma conversa. Se não
            fizer sentido pro seu caso, fica o aprendizado.
          </p>
        </section>

        <section
          className="work-section work-section--wide"
          aria-labelledby="work-services"
        >
          <h2 id="work-services" className="work-section-title">
            Como eu posso ajudar
          </h2>
          <ServiceGroups />
        </section>

        <section className="work-section" aria-labelledby="work-standard">
          <h2 id="work-standard" className="work-section-title">
            Como eu trabalho
          </h2>
          <ol className="work-formats">
            {STANDARD.map((item) => (
              <li key={item.title} className="work-format">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ol>
          <p className="work-note">
            Uso IA todos os dias na engenharia, com revisão humana em tudo. E
            quando a resposta honesta é "depende" ou "nem sempre vale", é isso
            que eu digo.
          </p>
        </section>

        <aside className="quote-cta" aria-labelledby="work-cta-title">
          <h2 id="work-cta-title" className="quote-cta-title">
            Vamos conversar?
          </h2>
          <p className="quote-cta-text">
            Responda algumas perguntas rápidas e eu te indico o caminho certo.
            Menos de dois minutos.
          </p>
          <div className="quote-cta-actions">
            <Link href="/contato/" className="button">
              Fale comigo
            </Link>
          </div>
        </aside>

        <section className="work-section" aria-labelledby="work-later">
          <h2 id="work-later" className="work-section-title">
            Ainda não é a hora?
          </h2>
          <p className="work-note">
            Sem problema. Leia os <Link href="/writing/">artigos</Link>, veja as{' '}
            <Link href="/presentations/">palestras</Link> ou acompanhe o que eu
            publico nas redes.
          </p>
        </section>
      </article>
    </PageWrapper>
  );
}
