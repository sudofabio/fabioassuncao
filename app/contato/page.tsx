import type { Metadata } from 'next';

import ContactIcons from '@/components/Contact/ContactIcons';
import QualifierChat from '@/components/Contact/QualifierChat';
import WhatsappLink from '@/components/Contact/WhatsappLink';
import { SchemaGraph } from '@/components/Schema';
import PageWrapper from '@/components/Template/PageWrapper';
import ThemePortrait from '@/components/Template/ThemePortrait';
import { WHATSAPP_DISPLAY } from '@/data/contact';
import profile from '@/data/profile.json';
import { createPageMetadata } from '@/lib/metadata';
import { breadcrumbNode, HOME_URL, SITE_URL, webPageNode } from '@/lib/schema';

const PAGE_URL = `${SITE_URL}/contato/`;
const PAGE_TITLE = 'Fale comigo';
const PAGE_DESCRIPTION = `Fale com ${profile.name}: responda algumas perguntas rápidas sobre o seu projeto, ou chame direto no WhatsApp ou por e-mail.`;

export const metadata: Metadata = createPageMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: '/contato/',
});

/**
 * The destination of every social bio (phase 2 of the funnel): one page, one
 * conversation. The chat qualifies the lead; the direct channels stay visible
 * for anyone who would rather just talk.
 */
export default function ContactPage() {
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
      <section className="contact-chat-page">
        <header className="contact-chat-header">
          <span className="contact-chat-avatar">
            <ThemePortrait width={56} height={56} priority />
          </span>
          <div>
            <p className="section-label">Contato</p>
            <h1 className="page-title">{PAGE_TITLE}</h1>
            <p className="contact-chat-lede">
              Algumas perguntas rápidas, menos de dois minutos, para eu te
              indicar o caminho certo.
            </p>
          </div>
        </header>

        <QualifierChat />

        <noscript>
          <p className="quote-notice">
            O chat precisa de JavaScript. Escreva para{' '}
            <a href={`mailto:${profile.email}`}>{profile.email}</a>.
          </p>
        </noscript>

        <aside
          className="contact-direct"
          aria-labelledby="contact-direct-title"
        >
          <h2 id="contact-direct-title" className="section-label">
            Prefere falar direto?
          </h2>
          <p>
            <WhatsappLink>WhatsApp {WHATSAPP_DISPLAY}</WhatsappLink> ·{' '}
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
          </p>
          <ContactIcons includeEmail={false} />
        </aside>
      </section>
    </PageWrapper>
  );
}
