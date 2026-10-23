import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import Experience from '@/components/Resume/Experience';
import Footer from '@/components/Template/Footer';
import profile from '@/data/profile.json';
import type { Position } from '@/data/resume/work';
import { buildJsonResume } from '@/lib/resumeJson';
import { personNode } from '@/lib/schema';

/**
 * Three places name the job held now: the experience spine on the resume, the
 * footer on every page, and the JSON-LD `Person` node crawlers read. They must
 * agree, and the only way to keep them agreeing is for all three to derive the
 * role rather than read `work[0]`.
 *
 * The fixture is adversarial on purpose. Its source order is what a real job
 * change produces — close the old role in place, append the new one — so the
 * current role is *last* in the array. Against the real `work` data, where the
 * current role happens to sit first, indexing would pass this test by luck.
 */
const career = vi.hoisted<Position[]>(() => [
  {
    name: 'Previous Co',
    position: 'Staff Engineer',
    url: 'https://previous.example',
    startDate: '2019-01-01',
    endDate: '2026-01-01',
  },
  {
    name: 'Side Fund',
    position: 'Co-founder',
    url: 'https://side.example',
    startDate: '2017-04-01',
    commitment: 'part-time',
  },
  {
    name: 'Current Co',
    position: 'Principal Engineer',
    url: 'https://current.example',
    startDate: '2026-01-01',
  },
]);

vi.mock('@/data/resume/work', () => ({ default: career }));

const NOW = new Date('2026-08-11T12:00:00Z').getTime();

/** The company and title the resume spine puts at the top. */
function leadOfSpine() {
  const { container, unmount } = render(<Experience data={career} now={NOW} />);
  const lead = container.querySelector('.jobs-container');
  const role = {
    company: lead?.querySelector('.job-company')?.textContent,
    title: lead?.querySelector('.job-position')?.textContent,
  };
  unmount();

  return role;
}

describe('the role the site says its author holds now', () => {
  it('leads the JSON Resume even when appended last in source data', () => {
    expect(buildJsonResume().work.map((job) => job.name)).toEqual([
      'Current Co',
      'Previous Co',
      'Side Fund',
    ]);
  });

  it('is not the first entry in the source data, so indexing cannot pass', () => {
    expect(leadOfSpine().company).not.toBe(career[0].name);
    expect(leadOfSpine().company).toBe('Current Co');
  });

  it('is what the footer prints on every page', () => {
    const { company, title } = leadOfSpine();
    const { container } = render(<Footer />);

    expect(container.querySelector('.footer-role')?.textContent).toBe(
      `${title} · ${company}`,
    );
  });

  // The Person's headline title is the profile role (shared with the hero and
  // the share card); the employer is the one the spine leads with.
  it('is the employer the JSON-LD Person node claims', () => {
    const { company } = leadOfSpine();
    const person = personNode();

    expect(person.jobTitle).toBe(profile.role);
    expect((person.worksFor as Record<string, unknown>).name).toBe(company);
  });

  // While the employer is unpublished, neither surface may invent one.
  describe('when the current role names no employer', () => {
    function withAnonymousCurrentRole(check: () => void) {
      const original = career[2];
      const { name: _name, url: _url, ...anonymous } = original;
      career[2] = anonymous;
      try {
        check();
      } finally {
        career[2] = original;
      }
    }

    it('prints the role alone in the footer', () => {
      withAnonymousCurrentRole(() => {
        const { container } = render(<Footer />);

        expect(container.querySelector('.footer-role')?.textContent).toBe(
          'Principal Engineer',
        );
      });
    });

    it('leaves worksFor out of the JSON-LD Person node', () => {
      withAnonymousCurrentRole(() => {
        expect(personNode()).not.toHaveProperty('worksFor');
      });
    });
  });
});
