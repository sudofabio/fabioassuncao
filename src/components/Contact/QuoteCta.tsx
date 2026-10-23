import Link from 'next/link';

import { whatsappLink } from '@/data/contact';

interface QuoteCtaProps {
  title?: string;
  text?: string;
}

/** The closing call to action shared by talks and the contact surfaces. */
export default function QuoteCta({
  title = 'Vamos conversar?',
  text = 'Consultoria, palestra ou mentoria para o seu time: conte o contexto e eu respondo com os próximos passos.',
}: QuoteCtaProps) {
  return (
    <aside className="quote-cta" aria-labelledby="quote-cta-title">
      <h2 id="quote-cta-title" className="quote-cta-title">
        {title}
      </h2>
      <p className="quote-cta-text">{text}</p>
      <div className="quote-cta-actions">
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
    </aside>
  );
}
