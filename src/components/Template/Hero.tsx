import Link from 'next/link';

import { whatsappLink } from '@/data/contact';
import profile from '@/data/profile.json';

import ThemePortrait from './ThemePortrait';

/**
 * The landing for every social-bio click, which almost always arrives on a
 * phone inside an in-app browser. At 375px the portrait, name, one line of
 * authority, and both calls to action must sit above the fold, so the mobile
 * layout puts a small portrait beside the name and the large one is shown
 * only where there is room for it.
 */
export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-grid">
        <div className="hero-primary">
          <p className="hero-kicker">Backend · Arquitetura · Cloud</p>
          <div className="hero-identity">
            <span className="hero-avatar">
              <ThemePortrait width={72} height={72} priority />
            </span>
            <h1 className="hero-title">
              <span className="hero-name">{profile.name}</span>
            </h1>
          </div>
          <p className="hero-tagline">
            Desenvolvedor de software, Tech Lead e empreendedor, com mais de 15
            anos de experiência em backend, arquitetura de sistemas, cloud
            computing e liderança técnica.
          </p>

          <p className="hero-summary">
            Atuo na construção de soluções escaláveis, conectando engenharia,
            produto e negócio.
          </p>

          <div className="hero-cta">
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
          <div className="hero-more">
            <Link href="/about" className="hero-resume-link">
              Sobre mim
            </Link>
            <Link href="/resume" className="hero-resume-link">
              Currículo
            </Link>
          </div>
        </div>

        <figure className="hero-portrait">
          <ThemePortrait width={320} height={320} priority />
          <figcaption>{profile.location}</figcaption>
        </figure>
      </div>
    </section>
  );
}
