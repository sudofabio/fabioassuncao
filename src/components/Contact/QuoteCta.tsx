import Link from 'next/link';

import WhatsappLink from './WhatsappLink';

interface QuoteCtaProps {
  title?: string;
  text?: string;
}

/** The closing call to action shared by talks and the contact surfaces. */
export default function QuoteCta({
  title = 'Vamos conversar?',
  text = 'Projeto, consultoria, palestra ou mentoria: conte o contexto e eu te indico o caminho certo.',
}: QuoteCtaProps) {
  return (
    <aside className="quote-cta" aria-labelledby="quote-cta-title">
      <h2 id="quote-cta-title" className="quote-cta-title">
        {title}
      </h2>
      <p className="quote-cta-text">{text}</p>
      <div className="quote-cta-actions">
        <Link href="/contato/" className="button">
          Fale comigo
        </Link>
        <WhatsappLink className="button button-secondary">
          WhatsApp
        </WhatsappLink>
      </div>
    </aside>
  );
}
