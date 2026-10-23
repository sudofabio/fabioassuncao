import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { STANDARD } from '@/data/pillars';
import { SERVICES_NOTE, serviceGroups } from '@/data/services';

import WorkWithMePage from '../trabalhe-comigo/page';

/** jsdom never applies `trailingSlash`, so the slash is normalised away. */
const route = (href: string | null) => href?.replace(/\/$/, '') ?? '';

describe('trabalhe comigo page ("O que eu faço")', () => {
  it('opens on the client pains, then the services, the method and the CTA', () => {
    const { container } = render(<WorkWithMePage />);
    const page = within(container.querySelector('article') as HTMLElement);

    expect(
      page.getByRole('heading', { level: 1, name: 'O que eu faço' }),
    ).toBeInTheDocument();
    expect(
      page
        .getAllByRole('heading', { level: 2 })
        .map((heading) => heading.textContent),
    ).toEqual([
      'Isso é você?',
      'Como eu posso ajudar',
      'Como eu trabalho',
      'Vamos conversar?',
      'Ainda não é a hora?',
    ]);
  });

  it('lists the five service groups and every service from the data', () => {
    const { container } = render(<WorkWithMePage />);

    const groups = container.querySelectorAll('.service-group');
    expect(groups).toHaveLength(serviceGroups.length);
    expect(serviceGroups).toHaveLength(5);

    for (const group of serviceGroups) {
      const node = container.querySelector(`#${group.id}`);
      expect(node, group.id).not.toBeNull();
      const scope = within(node as HTMLElement);
      expect(scope.getByText(group.need)).toBeInTheDocument();
      for (const service of group.services) {
        expect(scope.getByText(service.name)).toBeInTheDocument();
        expect(scope.getByText(service.summary)).toBeInTheDocument();
      }
    }
  });

  it('publishes no price while none is decided', () => {
    const { container } = render(<WorkWithMePage />);

    expect(container.querySelector('.service-price')).toBeNull();
    expect(container.textContent).not.toMatch(/R\$\s?\d/);
  });

  it('prints the commitments under the services', () => {
    render(<WorkWithMePage />);

    expect(screen.getByText(SERVICES_NOTE)).toBeInTheDocument();
  });

  it('explains how Fábio works with the three-part standard', () => {
    render(<WorkWithMePage />);

    for (const item of STANDARD) {
      expect(
        screen.getByRole('heading', { level: 3, name: item.title }),
      ).toBeInTheDocument();
    }
  });

  it('sends every call to action to the chat and carries no form', () => {
    const { container } = render(<WorkWithMePage />);
    const page = within(container.querySelector('article') as HTMLElement);

    const cta = page.getByRole('link', { name: 'Fale comigo' });
    expect(route(cta.getAttribute('href'))).toBe('/contato');
    expect(container.querySelector('form')).toBeNull();
    expect(container.querySelector('#orcamento')).toBeNull();
  });
});
