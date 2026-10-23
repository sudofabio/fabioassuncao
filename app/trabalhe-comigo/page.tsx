import type { Metadata } from 'next';
import Link from 'next/link';

import QuoteForm from '@/components/Contact/QuoteForm';
import { SchemaGraph } from '@/components/Schema';
import PageWrapper from '@/components/Template/PageWrapper';
import { whatsappLink } from '@/data/contact';
import { createPageMetadata } from '@/lib/metadata';
import { breadcrumbNode, HOME_URL, SITE_URL, webPageNode } from '@/lib/schema';
import { AUTHOR_NAME } from '@/lib/utils';

const PAGE_URL = `${SITE_URL}/trabalhe-comigo/`;
const PAGE_TITLE = 'Trabalhe comigo';
const PAGE_DESCRIPTION = `Consultoria, palestras e mentoria com ${AUTHOR_NAME} em backend, arquitetura de software, cloud e liderança técnica. Peça um orçamento.`;

export const metadata: Metadata = createPageMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: '/trabalhe-comigo/',
});

/** Situations a prospective client recognises before reading anything else. */
const PAINS = [
  'O sistema cresceu, ficou lento ou instável, e cada mudança parece arriscada.',
  'O time entrega, mas as decisões de arquitetura foram se acumulando sem um norte.',
  'A conta da cloud sobe todo mês e ninguém sabe exatamente por quê.',
  'Você quer usar IA no desenvolvimento sem trocar qualidade por velocidade.',
  'Precisa de alguém experiente para revisar uma decisão antes de investir nela.',
];

/**
 * Engagement formats. TODO(fabio): confirmar formatos, duração, entregáveis e
 * como cada um é cobrado; o texto abaixo descreve só o escopo de cada um.
 */
const FORMATS = [
  {
    title: 'Consultoria e diagnóstico técnico',
    text: 'Uma análise do sistema, da arquitetura e da infraestrutura, com um diagnóstico claro dos riscos e um plano priorizado do que atacar primeiro.',
  },
  {
    title: 'Acompanhamento e mentoria',
    text: 'Encontros recorrentes com você ou com o seu time para tomar decisões de arquitetura, revisar código e destravar a evolução do produto.',
  },
  {
    title: 'Palestras e workshops',
    text: 'Conteúdo sobre desenvolvimento de software, arquitetura, cloud e o papel do desenvolvedor na era da IA, para eventos, empresas e instituições de ensino.',
  },
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
          <h1 className="page-title">{PAGE_TITLE}</h1>
          <p className="page-subtitle">
            Ajudo empresas e times a construir e evoluir software com segurança:
            backend, arquitetura de sistemas, cloud e liderança técnica.
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
            Se alguma dessas frases soou familiar, vale uma conversa.
          </p>
        </section>

        <section className="work-section" aria-labelledby="work-formats">
          <h2 id="work-formats" className="work-section-title">
            Como posso ajudar
          </h2>
          <ol className="work-formats">
            {FORMATS.map((format) => (
              <li key={format.title} className="work-format">
                <h3>{format.title}</h3>
                <p>{format.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section
          id="orcamento"
          className="work-section work-quote"
          aria-labelledby="work-quote-title"
        >
          <h2 id="work-quote-title" className="work-section-title">
            Pedir orçamento
          </h2>
          <p className="work-note">
            Conte o contexto do projeto e eu retorno por e-mail. Prefere
            conversar direto?{' '}
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
              Chame no WhatsApp
              <span className="sr-only"> (abre em nova aba)</span>
            </a>
            .
          </p>
          <QuoteForm />
        </section>

        <section className="work-section" aria-labelledby="work-later">
          <h2 id="work-later" className="work-section-title">
            Ainda não é a hora?
          </h2>
          <p className="work-note">
            Sem problema. Leia os <Link href="/writing/">artigos</Link>, veja as{' '}
            <Link href="/presentations/">palestras</Link> ou acompanhe pelas
            redes em <Link href="/links/">fabioassuncao.com/links</Link>.
          </p>
        </section>
      </article>
    </PageWrapper>
  );
}
