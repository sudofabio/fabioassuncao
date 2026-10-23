import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { WHATSAPP_NUMBER } from '@/data/contact';
import profile from '@/data/profile.json';
import work from '@/data/resume/work';
import { currentPosition } from '@/lib/career';

import Footer from '../../Template/Footer';

describe('Footer', () => {
  it('renders the footer with correct structure', () => {
    render(<Footer />);

    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });

  it('displays the name and the current role with its company', () => {
    render(<Footer />);

    expect(screen.getByText(profile.name)).toBeInTheDocument();
    const current = currentPosition(work);
    expect(current?.name).toBe('Codions');
    expect(
      screen.getByText(`${current?.position} · ${current?.name}`),
    ).toBeInTheDocument();
    expect(screen.queryByText(/undefined|\bat\b/)).not.toBeInTheDocument();
  });

  it('closes every page with "Vamos conversar?" as its only heading', () => {
    render(<Footer />);

    const headings = screen.getAllByRole('heading');
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent('Vamos conversar?');
  });

  it('offers the chat, WhatsApp and the public e-mail in that closing', () => {
    const { container } = render(<Footer />);
    const cta = container.querySelector('.footer-cta') as HTMLElement;

    const talk = within(cta).getByRole('link', { name: 'Fale comigo' });
    expect(talk.getAttribute('href')).toMatch(/^\/contato\/?$/);

    const whatsapp = within(cta).getByRole('link', { name: /whatsapp/i });
    expect(whatsapp).toHaveTextContent('WhatsApp (98) 98564-3922');
    expect(whatsapp.getAttribute('href')).toMatch(
      new RegExp(`^https://wa\\.me/${WHATSAPP_NUMBER}\\?text=`),
    );

    const email = within(cta).getByRole('link', { name: profile.email });
    expect(email).toHaveAttribute('href', 'mailto:contato@fabioassuncao.com');
  });

  it('links the privacy policy', () => {
    render(<Footer />);

    const privacy = screen.getByRole('link', { name: 'Privacidade' });
    expect(privacy.getAttribute('href')).toMatch(/^\/privacidade\/?$/);
  });

  it('displays the current year in copyright', () => {
    render(<Footer />);

    const currentYear = new Date().getFullYear().toString();
    expect(
      screen.getByText(new RegExp(`© ${currentYear}`)),
    ).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<Footer />);

    expect(screen.getByRole('link', { name: /^sobre$/i })).toHaveAttribute(
      'href',
      '/about',
    );
    expect(screen.getByRole('link', { name: /currículo/i })).toHaveAttribute(
      'href',
      '/resume',
    );
    expect(screen.getByRole('link', { name: /projetos/i })).toHaveAttribute(
      'href',
      '/projects',
    );
    expect(screen.getByRole('link', { name: /palestras/i })).toHaveAttribute(
      'href',
      '/presentations',
    );
    expect(screen.getByRole('link', { name: /^contato$/i })).toHaveAttribute(
      'href',
      '/contato',
    );
    expect(
      screen.getByRole('link', { name: /^o que eu faço$/i }),
    ).toHaveAttribute('href', '/trabalhe-comigo');
  });

  it('renders contact icons section', () => {
    render(<Footer />);

    // Contact icons are rendered via ContactIcons component
    const socialSection = document.querySelector('.footer-social');
    expect(socialSection).toBeInTheDocument();
    expect(screen.getByText('Redes')).toBeInTheDocument();
  });

  it('links the source to this repository, in a new tab', () => {
    render(<Footer />);

    const source = screen.getByRole('link', { name: /código-fonte/i });
    expect(source).toHaveAttribute(
      'href',
      'https://github.com/fabioassuncao/fabioassuncao',
    );
    expect(source).toHaveAttribute('target', '_blank');
    expect(source).toHaveTextContent('(abre em nova aba)');
  });

  it('has link to home from avatar', () => {
    render(<Footer />);

    const avatarLink = document.querySelector('.footer-avatar');
    expect(avatarLink).toHaveAttribute('href', '/');
  });
});
