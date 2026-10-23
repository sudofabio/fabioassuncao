import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import SkillTag from '../../Resume/Skills/SkillTag';

describe('SkillTag', () => {
  it('renders the skill title', () => {
    const skill = { title: 'Python', competency: 5, category: ['Languages'] };

    render(<SkillTag data={skill} />);

    expect(screen.getByText('Python')).toBeInTheDocument();
  });

  /**
   * The tier used to be a numeric `aria-label` on a bare `<span>`, which maps
   * to role `generic` and discards accessible names, so it reached nobody. It
   * is real text now: hidden from sight, part of the phrase read aloud.
   */
  it('states the competency tier in visually hidden text', () => {
    const skill = { title: 'Python', competency: 5, category: ['Languages'] };

    render(<SkillTag data={skill} />);

    const tag = document.querySelector('.skill-tag') as HTMLElement;
    expect(tag).toHaveClass('skill-tag--deep');
    expect(tag.querySelector('.sr-only')).toHaveTextContent(
      ', domínio profundo',
    );
    expect(tag.textContent).toBe('Python, domínio profundo');
    expect(tag.querySelector('.skill-tag-name')?.textContent).toBe('Python');
  });

  it('applies the working tier class one below the top', () => {
    const skill = {
      title: 'JavaScript',
      competency: 4,
      category: ['Languages'],
    };

    render(<SkillTag data={skill} />);

    const tag = document.querySelector('.skill-tag');
    expect(tag).toHaveClass('skill-tag--working');
    expect(tag?.querySelector('.sr-only')).toHaveTextContent('domínio prático');
  });

  it('applies the familiar tier class for competency 3 or below', () => {
    const skill = { title: 'Ruby', competency: 3, category: ['Languages'] };

    render(<SkillTag data={skill} />);

    const tag = document.querySelector('.skill-tag');
    expect(tag).toHaveClass('skill-tag--familiar');
    expect(tag?.querySelector('.sr-only')).toHaveTextContent('familiaridade');
  });

  // No declared level means no tier: the tag must not imply a proficiency
  // nobody stated, visually or to a screen reader.
  it('renders a plain tag when no competency is declared', () => {
    render(<SkillTag data={{ title: 'Go', category: ['Backend'] }} />);

    const tag = document.querySelector('.skill-tag') as HTMLElement;
    expect(tag.className).toBe('skill-tag');
    expect(tag.querySelector('.sr-only')).toBeNull();
    expect(tag.textContent).toBe('Go');
  });
});
