import Link from 'next/link';

export default function References() {
  return (
    <div className="references">
      {/* The sticky index links to #references, so the section needs a
          heading to land on like every other one. */}
      <div className="title">
        <h2>Referências</h2>
      </div>
      <p className="text-sm text-[var(--color-fg-light)] text-center">
        Referências disponíveis mediante solicitação.{' '}
        <Link
          href="/contato"
          className="font-medium text-[var(--color-accent)] hover:text-[var(--color-fg-bold)] transition-colors duration-150"
        >
          Fale comigo →
        </Link>
      </p>
    </div>
  );
}
