import type { Metadata } from 'next';
import Link from 'next/link';

import ContactIcons from '@/components/Contact/ContactIcons';
import EmailLink from '@/components/Contact/EmailLink';
import PageWrapper from '@/components/Template/PageWrapper';
import { whatsappLink } from '@/data/contact';
import profile from '@/data/profile.json';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Fale comigo',
  description: `Fale com ${profile.name} por e-mail (${profile.email}), WhatsApp ou redes sociais, ou peça um orçamento.`,
  path: '/contact/',
});

export default function ContactPage() {
  return (
    <PageWrapper hideFooter mainClassName="page-main--contact">
      <section className="contact-page">
        <header className="contact-header">
          <h1 className="page-title">Fale comigo</h1>
        </header>

        <div className="contact-content">
          <div className="contact-email-block">
            <EmailLink />
            <p className="contact-hint">
              Para um projeto, palestra ou mentoria, o caminho mais rápido é o{' '}
              <Link href="/trabalhe-comigo/#orcamento">
                pedido de orçamento
              </Link>
              .
            </p>
          </div>

          <div className="contact-actions">
            <Link href="/trabalhe-comigo/#orcamento" className="button">
              Pedir orçamento
            </Link>
            <a
              href={whatsappLink()}
              className="button button-secondary"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
              <span className="sr-only"> (abre em nova aba)</span>
            </a>
          </div>

          <div className="contact-divider">
            <span>ou me encontre em</span>
          </div>

          <ContactIcons includeEmail={false} />
        </div>
      </section>
    </PageWrapper>
  );
}
