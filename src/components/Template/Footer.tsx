import Link from 'next/link';

import ContactIcons from '@/components/Contact/ContactIcons';
import WhatsappLink from '@/components/Contact/WhatsappLink';
import { WHATSAPP_DISPLAY } from '@/data/contact';
import profile from '@/data/profile.json';
import work from '@/data/resume/work';
import routes from '@/data/routes';
import { currentPosition } from '@/lib/career';
import { AUTHOR_NAME } from '@/lib/utils';

import ThemePortrait from './ThemePortrait';

export default function Footer() {
  const current = currentPosition(work);

  return (
    <footer className="site-footer-new">
      {/* The fixed closing of every page (site-fabio.md §7). */}
      <section className="footer-cta" aria-labelledby="footer-cta-title">
        <h2 id="footer-cta-title" className="footer-cta-title">
          Vamos conversar?
        </h2>
        <div className="footer-cta-actions">
          <Link href="/contato/" className="button">
            Fale comigo
          </Link>
          <WhatsappLink className="footer-cta-link">
            WhatsApp {WHATSAPP_DISPLAY}
          </WhatsappLink>
          <a href={`mailto:${profile.email}`} className="footer-cta-link">
            {profile.email}
          </a>
        </div>
      </section>
      <div className="footer-content">
        <div className="footer-identity">
          <Link href="/" className="footer-avatar">
            <ThemePortrait width={80} height={80} />
          </Link>
          <div className="footer-info">
            <span className="footer-name">{AUTHOR_NAME}</span>
            {current ? (
              <p className="footer-role">
                {current.name
                  ? `${current.position} · ${current.name}`
                  : current.position}
              </p>
            ) : null}
            <p className="footer-copyright">
              &copy; {new Date().getFullYear()} ·{' '}
              <a
                href="https://github.com/fabioassuncao/fabioassuncao"
                target="_blank"
                rel="noopener noreferrer"
              >
                Código-fonte
                <span className="sr-only"> (abre em nova aba)</span>
              </a>{' '}
              · <Link href="/privacidade/">Privacidade</Link>
            </p>
          </div>
        </div>

        <div className="footer-right">
          {/* Driven from the same route registry as the header, which had
              drifted: the footer was missing whole sections.
              These are group labels, not document sections, so they are
              spans rather than headings. */}
          <nav className="footer-links" aria-labelledby="footer-links-heading">
            <span id="footer-links-heading" className="footer-links-label">
              Navegue
            </span>
            <div className="footer-links-grid">
              {routes
                .filter((route) => !route.index)
                .map((route) => (
                  <Link key={route.path} href={route.path}>
                    {route.label}
                  </Link>
                ))}
            </div>
          </nav>

          <div
            className="footer-social"
            aria-labelledby="footer-social-heading"
          >
            <span id="footer-social-heading" className="footer-social-label">
              Redes
            </span>
            <ContactIcons />
          </div>
        </div>
      </div>
    </footer>
  );
}
