import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { WHATSAPP_NUMBER } from '@/data/contact';
import profile from '@/data/profile.json';

import Hero from '../../Template/Hero';

describe('Hero', () => {
  it('renders the hero section', () => {
    render(<Hero />);

    const heroSection = document.querySelector('.hero');
    expect(heroSection).toBeInTheDocument();
  });

  it('displays the name as the only level-one heading', () => {
    render(<Hero />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent(profile.name);
  });

  it('states the authority line from the speaker bio', () => {
    const { container } = render(<Hero />);

    expect(container.querySelector('.hero-tagline')).toHaveTextContent(
      'Desenvolvedor de software, Tech Lead e empreendedor, com mais de 15 anos de experiência em backend, arquitetura de sistemas, cloud computing e liderança técnica.',
    );
  });

  it('ships both portraits with the person as their accessible name', () => {
    const { container } = render(<Hero />);

    // The small one is for phones, the figure for wider screens; CSS shows one.
    expect(container.querySelector('.hero-avatar img')).toHaveAttribute(
      'alt',
      profile.name,
    );
    expect(container.querySelector('.hero-portrait img')).toHaveAttribute(
      'alt',
      profile.name,
    );
  });

  it('keeps personal stats and incomplete credential lists off the homepage', () => {
    const { container } = render(<Hero />);

    expect(container.querySelector('.telemetry')).not.toBeInTheDocument();
    expect(container.querySelector('.hero-chips')).not.toBeInTheDocument();
  });

  it('leads with the quote request and WhatsApp as the two calls to action', () => {
    render(<Hero />);

    const quote = screen.getByRole('link', { name: 'Pedir orçamento' });
    // jsdom never applies `trailingSlash`, so the slash is normalised away.
    expect(quote.getAttribute('href')).toMatch(
      /^\/trabalhe-comigo\/?#orcamento$/,
    );
    expect(quote).toHaveClass('button');
    expect(quote).not.toHaveClass('button-secondary');

    const whatsapp = screen.getByRole('link', { name: /whatsapp/i });
    expect(whatsapp.getAttribute('href')).toMatch(
      new RegExp(`^https://wa\\.me/${WHATSAPP_NUMBER}\\?text=`),
    );
    expect(whatsapp).toHaveClass('button', 'button-secondary');
    expect(whatsapp).toHaveAttribute('target', '_blank');
    expect(whatsapp).toHaveAttribute('rel', 'noopener noreferrer');
    expect(whatsapp).toHaveTextContent('(abre em nova aba)');
  });

  it('keeps the about and résumé links quieter than the actions', () => {
    render(<Hero />);

    const about = screen.getByRole('link', { name: 'Sobre mim' });
    expect(about).toHaveAttribute('href', '/about');
    expect(about).not.toHaveClass('button');

    const resume = screen.getByRole('link', { name: 'Currículo' });
    expect(resume).toHaveAttribute('href', '/resume');
    expect(resume).toHaveClass('hero-resume-link');
    expect(resume).not.toHaveClass('button');
  });
});
