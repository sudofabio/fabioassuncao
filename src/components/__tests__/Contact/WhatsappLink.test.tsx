import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { WHATSAPP_GREETING, WHATSAPP_NUMBER } from '@/data/contact';

const { onWhatsappClick } = vi.hoisted(() => ({ onWhatsappClick: vi.fn() }));
vi.mock('@/lib/analytics', () => ({ onWhatsappClick }));

import WhatsappLink from '../../Contact/WhatsappLink';

describe('WhatsappLink', () => {
  it('opens wa.me with the site greeting by default', () => {
    render(<WhatsappLink>WhatsApp</WhatsappLink>);

    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_GREETING)}`,
    );
  });

  it('carries a custom message, encoded', () => {
    render(<WhatsappLink text="Oi, Fábio! Aqui é Ana.">Falar</WhatsappLink>);

    expect(screen.getByRole('link').getAttribute('href')).toBe(
      `https://wa.me/${WHATSAPP_NUMBER}?text=Oi%2C%20F%C3%A1bio!%20Aqui%20%C3%A9%20Ana.`,
    );
  });

  it('opens a new tab safely and says so to screen readers', () => {
    render(<WhatsappLink className="button">WhatsApp</WhatsappLink>);

    const link = screen.getByRole('link', {
      name: /WhatsApp.*abre em nova aba/,
    });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(link).toHaveClass('button');
    expect(link.querySelector('.sr-only')).toHaveTextContent(
      '(abre em nova aba)',
    );
  });

  it('reports the contact on click', () => {
    render(<WhatsappLink>WhatsApp</WhatsappLink>);

    fireEvent.click(screen.getByRole('link'));
    expect(onWhatsappClick).toHaveBeenCalledTimes(1);
  });
});
