import Link from 'next/link';

import profile from '@/data/profile.json';

import ThemePortrait from './ThemePortrait';

/**
 * Approved proof points (social media project, `01-contexto/fabio.md`). The
 * 600+ projects belong to the Codions, and the line says so.
 */
export const HERO_PROOFS = [
  '+15 anos programando',
  'Tech Lead do Portal QEdu (9,5 mi+ usuários)',
  'Fundador da Codions, com 600+ projetos entregues',
] as const;

/**
 * The landing for every social-bio click, which almost always arrives on a
 * phone inside an in-app browser. At 375px the name, the one-line promise,
 * what Fábio does, and both calls to action sit above the fold; the proof
 * line and the large portrait follow where there is room.
 *
 * Copy: `05-perfis/site-fabio.md` §2 of the social media project.
 */
export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-grid">
        <div className="hero-primary">
          <p className="hero-kicker">
            Engenheiro de software desde {profile.computingSince} ·{' '}
            {profile.location}
          </p>
          <div className="hero-identity">
            <span className="hero-avatar">
              <ThemePortrait width={72} height={72} priority />
            </span>
            <h1 className="hero-title">
              <span className="hero-name">{profile.name}</span>
            </h1>
          </div>
          <p className="hero-tagline">
            IA, código e segurança.{' '}
            <strong className="hero-signal">Sem hype</strong>, com 15 anos de
            estrada.
          </p>

          <p className="hero-summary">
            Eu ajudo empresas a construir, modernizar e proteger sistemas, e a
            usar IA onde ela realmente faz diferença.
          </p>

          <div className="hero-cta">
            <Link href="/contato/" className="button">
              Fale comigo
            </Link>
            <Link href="/trabalhe-comigo/" className="button button-secondary">
              Ver o que eu faço
            </Link>
          </div>

          <ul className="hero-proofs" aria-label="Experiência">
            {HERO_PROOFS.map((proof) => (
              <li key={proof}>{proof}</li>
            ))}
          </ul>
        </div>

        <figure className="hero-portrait">
          <ThemePortrait width={320} height={320} priority />
          <figcaption>
            {profile.name} · {profile.location}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
