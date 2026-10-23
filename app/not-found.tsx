import type { Metadata } from 'next';
import Link from 'next/link';
import { MAIN_CONTENT_ID } from '@/components/Template/PageWrapper';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Página não encontrada',
  description: 'A página que você procura não existe ou mudou de endereço.',
});

export default function NotFound() {
  return (
    <main id={MAIN_CONTENT_ID} tabIndex={-1} className="not-found-page">
      <div className="not-found-content">
        <span className="not-found-code">404</span>
        <h1 className="not-found-title">Página não encontrada</h1>
        <p className="not-found-message">
          A página que você procura não existe ou mudou de endereço.
        </p>
        <div className="not-found-actions">
          <Link href="/" className="button">
            Ir para o início
          </Link>
          <Link href="/contato" className="button button-secondary">
            Fale comigo
          </Link>
        </div>
      </div>
    </main>
  );
}
