import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import References from '../../Resume/References';

describe('References', () => {
  it('renders the references section', () => {
    render(<References />);

    expect(
      screen.getByText(/referências disponíveis mediante solicitação/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /referências/i }),
    ).toBeInTheDocument();
  });

  it('has a link to the contact page', () => {
    render(<References />);

    const link = screen.getByRole('link', {
      name: /fale comigo/i,
    });
    expect(link).toHaveAttribute('href', '/contato');
  });

  it('displays as minimal inline text', () => {
    render(<References />);

    const paragraph = screen.getByText(
      /referências disponíveis mediante solicitação/i,
    );
    expect(paragraph.tagName).toBe('P');
  });
});
