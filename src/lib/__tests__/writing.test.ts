import { describe, expect, it, vi } from 'vitest';

// `src/data/writing.ts` is empty until external articles exist, so the merge is
// exercised against a fixture: one dated and one undated external entry.
vi.mock('@/data/writing', () => ({
  default: [
    {
      title: 'Fixture external article',
      url: 'https://www.linkedin.com/pulse/fixture-article',
      date: '2020-01-01',
      description: 'Dated external fixture.',
    },
    {
      title: 'Fixture external guide',
      url: 'https://example.com/guide',
      date: '',
      description: 'Undated external fixture.',
    },
  ],
}));

import {
  compareWritingItems,
  getWritingItems,
  type WritingItem,
} from '../writing';

describe('getWritingItems', () => {
  it('merges published local posts and external writing newest first', () => {
    const items = getWritingItems();

    expect(items.some((item) => !item.isExternal)).toBe(true);
    expect(items.some((item) => item.isExternal)).toBe(true);
    // Undated guides sort after every dated entry.
    expect(items.at(-1)?.date).toBe('');
    expect(
      items.find((item) => item.url.includes('linkedin.com'))?.source,
    ).toBe('LinkedIn');

    const dated = items.filter((item) => item.date);
    expect(
      dated.every(
        (item, index) =>
          index === 0 || dated[index - 1]!.date.localeCompare(item.date) >= 0,
      ),
    ).toBe(true);
  });

  it('uses canonical trailing-slash URLs for local posts', () => {
    const localItems = getWritingItems().filter((item) => !item.isExternal);

    expect(localItems.length).toBeGreaterThan(0);
    expect(localItems.every((item) => item.url.endsWith('/'))).toBe(true);
    expect(localItems.every((item) => item.source === 'Neste site')).toBe(true);
  });

  it('orders equal and undated entries deterministically', () => {
    const item = (
      title: string,
      date: string,
      url = `https://example.com/${title.toLowerCase()}`,
    ): WritingItem => ({
      title,
      date,
      url,
      description: '',
      isExternal: true,
      source: 'Example',
    });

    expect(
      [item('Zulu', ''), item('Alpha', '')].sort(compareWritingItems),
    ).toEqual([item('Alpha', ''), item('Zulu', '')]);
    expect(
      [item('Zulu', '2026-01-01'), item('Alpha', '2026-01-01')].sort(
        compareWritingItems,
      ),
    ).toEqual([item('Alpha', '2026-01-01'), item('Zulu', '2026-01-01')]);
  });
});
