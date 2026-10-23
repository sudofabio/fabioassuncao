import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import profile from '@/data/profile.json';

import Hero, { HERO_PROOFS } from '../../Template/Hero';

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

  it('opens with the technical label: years and place', () => {
    const { container } = render(<Hero />);

    expect(container.querySelector('.hero-kicker')).toHaveTextContent(
      `Engenheiro de software desde ${profile.computingSince} · ${profile.location}`,
    );
    expect(container.querySelector('.hero-kicker')).toHaveTextContent(
      'Engenheiro de software desde 2008 · São Luís/MA',
    );
  });

  it('states the brand line with "Sem hype" as the one highlighted word', () => {
    const { container } = render(<Hero />);

    const tagline = container.querySelector('.hero-tagline');
    expect(tagline).toHaveTextContent(
      'IA, código e segurança. Sem hype, com 15 anos de estrada.',
    );
    const highlighted = tagline?.querySelectorAll('.hero-signal');
    expect(highlighted).toHaveLength(1);
    expect(highlighted?.[0]).toHaveTextContent('Sem hype');
  });

  it('says what Fábio does in one sentence', () => {
    const { container } = render(<Hero />);

    expect(container.querySelector('.hero-summary')).toHaveTextContent(
      'Eu ajudo empresas a construir, modernizar e proteger sistemas, e a usar IA onde ela realmente faz diferença.',
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

  it('leads with "Fale comigo" and "Ver o que eu faço" as the two actions', () => {
    render(<Hero />);

    // jsdom never applies `trailingSlash`, so the slash is normalised away.
    const talk = screen.getByRole('link', { name: 'Fale comigo' });
    expect(talk.getAttribute('href')).toMatch(/^\/contato\/?$/);
    expect(talk).toHaveClass('button');
    expect(talk).not.toHaveClass('button-secondary');

    const services = screen.getByRole('link', { name: 'Ver o que eu faço' });
    expect(services.getAttribute('href')).toMatch(/^\/trabalhe-comigo\/?$/);
    expect(services).toHaveClass('button', 'button-secondary');
  });

  it('lists the approved proofs, crediting the 600+ projects to the Codions', () => {
    const { container } = render(<Hero />);

    const items = [...container.querySelectorAll('.hero-proofs li')].map(
      (item) => item.textContent,
    );
    expect(items).toEqual([...HERO_PROOFS]);
    const projects = HERO_PROOFS.find((proof) => proof.includes('600+'));
    expect(projects).toMatch(/Codions/);
    expect(projects).toMatch(/600\+ projetos/);
    expect(
      screen.getByRole('list', { name: 'Experiência' }),
    ).toBeInTheDocument();
  });
});
