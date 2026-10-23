import { describe, expect, it } from 'vitest';

import { aboutMarkdown } from '@/data/about';
import profile from '@/data/profile.json';
import { extractLogMarker } from '../logEntry';

/** Bullets of one about-page section, as authored. */
function sectionEntries(title: string) {
  const body = aboutMarkdown.split(`# ${title}\n`)[1]?.split('\n# ')[0] ?? '';

  return body
    .split('\n')
    .filter((line) => line.startsWith('- '))
    .map((line) => line.slice(2));
}

describe('extractLogMarker', () => {
  it('lifts a leading age without inventing a year', () => {
    const result = extractLogMarker(
      'At 7, I discovered the mini-games hidden in Microsoft Office.',
    );

    expect(result).toEqual({
      age: '7 anos',
      rest: 'I discovered the mini-games hidden in Microsoft Office.',
    });
  });

  it('lifts an age range, with or without the leading "At"', () => {
    expect(
      extractLogMarker('At 14 - 17, I played a lot of video games.'),
    ).toEqual({
      age: '14–17 anos',
      rest: 'I played a lot of video games.',
    });

    expect(extractLogMarker('14 - 17, I played a lot of video games.')).toEqual(
      {
        age: '14–17 anos',
        rest: 'I played a lot of video games.',
      },
    );
  });

  it('accepts en and em dashes in a range', () => {
    expect(extractLogMarker('At 14–17, I played games.')?.age).toBe(
      '14–17 anos',
    );
    expect(extractLogMarker('At 14—17, I played games.')?.age).toBe(
      '14–17 anos',
    );
  });

  it('lifts a leading year without inventing an age', () => {
    expect(extractLogMarker('In 2016, I visited Canada and Ethiopia.')).toEqual(
      {
        year: '2016',
        rest: 'I visited Canada and Ethiopia.',
      },
    );
  });

  it('annotates a seasonal year without deleting the season', () => {
    expect(
      extractLogMarker('In the summer of 1996, my uncle purchased MegaRace.'),
    ).toEqual({
      year: '1996',
      rest: 'In the summer of 1996, my uncle purchased MegaRace.',
    });
  });

  it('recapitalises the remainder, which now opens the sentence', () => {
    expect(extractLogMarker('At 20, co-authored a grant.')?.rest).toBe(
      'Co-authored a grant.',
    );
  });

  it('lifts an age the sentence is built around', () => {
    expect(
      extractLogMarker('When I was 12, I set the all-time high record.'),
    ).toEqual({
      age: '12 anos',
      rest: 'I set the all-time high record.',
    });

    expect(
      extractLogMarker('I was 11 when I built my first Tesla Coil.'),
    ).toEqual({
      age: '11 anos',
      rest: 'I built my first Tesla Coil.',
    });
  });

  it('annotates a marker embedded in the prose without editing the prose', () => {
    // The words carry the date, so the gutter reads it rather than removes it.
    expect(
      extractLogMarker(
        'My parents put a computer in my bedroom in 1993 when I was 3. It was an old Tandy.',
      ),
    ).toEqual({
      year: '1993',
      age: '3 anos',
      rest: 'My parents put a computer in my bedroom in 1993 when I was 3. It was an old Tandy.',
    });

    expect(
      extractLogMarker('We subscribed to AOL in 1995. I still remember it.'),
    ).toEqual({
      year: '1995',
      rest: 'We subscribed to AOL in 1995. I still remember it.',
    });

    // Previously null: a mid-sentence year was ignored entirely, which left the
    // best entries on the page with an empty gutter.
    expect(extractLogMarker('I visited Canada in 2016, then Japan.')).toEqual({
      year: '2016',
      rest: 'I visited Canada in 2016, then Japan.',
    });
  });

  it('only reads a marker out of the opening sentence', () => {
    expect(
      extractLogMarker('I still have it. I bought it in 1998.'),
    ).toBeNull();
  });

  it('leaves entries that carry no temporal marker at all alone', () => {
    for (const text of [
      'I am an Oregon Trail II enthusiast.',
      'I am originally from Buffalo, New York. I have since lived in Palo Alto.',
      "I've been to approximately 50 countries, some of which I have forgotten.",
      'I have a list of thousands of ideas.',
    ]) {
      expect(extractLogMarker(text)).toBeNull();
    }
  });

  it('does not read a measured quantity after "I was" as an age', () => {
    // "6 months into" is a duration, not an age. Reading it as one invents the
    // precision the gutter exists to avoid, so the entry gets an empty gutter.
    for (const text of [
      'I was 6 months into building the product when the acquisition closed.',
      'I was 1 of 3 founders on that team.',
      'I was 3 hours from the border.',
      'I was 50 miles out and still climbing.',
      'I was 20 percent of the way through the list.',
    ]) {
      expect(extractLogMarker(text)).toBeNull();
    }
  });

  it('still reads an age stated without a comma after it', () => {
    // The measure-noun guard must not take valid phrasing down with it.
    expect(extractLogMarker('When I was 12 I set a record.')?.age).toBe(
      '12 anos',
    );
    expect(extractLogMarker('I was 9 and it rained all week.')?.age).toBe(
      '9 anos',
    );
    expect(
      extractLogMarker('At the age of 16 I drove across the country.')?.age,
    ).toBe('16 anos');
  });

  it('does not read a model number as a year', () => {
    expect(
      extractLogMarker('It was an old Tandy 2000 with a turbo button.'),
    ).toBeNull();
    expect(
      extractLogMarker('I shoot with a Nikon D750 and a D800 these days.'),
    ).toBeNull();
  });

  it('rejects a marker with nothing left after it', () => {
    expect(extractLogMarker('At 20, ')).toBeNull();
    expect(extractLogMarker('In 2016, ')).toBeNull();
  });

  it('is case-insensitive on the leading word', () => {
    expect(extractLogMarker('at 13, I went to space camp.')?.age).toBe(
      '13 anos',
    );
    expect(extractLogMarker('in 2019, I visited Canada.')?.year).toBe('2019');
  });
});

describe('extractLogMarker, pt-BR phrasing', () => {
  it('lifts a leading year range without inventing an age', () => {
    expect(
      extractLogMarker(
        'De 2008 a 2010, como estagiário, dei os primeiros passos.',
      ),
    ).toEqual({
      year: '2008–2010',
      rest: 'Como estagiário, dei os primeiros passos.',
    });
  });

  it('lifts an open-ended "Desde" year', () => {
    expect(
      extractLogMarker('Desde 2022, trabalho com sistemas distribuídos.'),
    ).toEqual({ year: '2022', rest: 'Trabalho com sistemas distribuídos.' });
  });

  it('lifts a single "Em" year', () => {
    expect(extractLogMarker('Em 2026, apresentei uma palestra.')).toEqual({
      year: '2026',
      rest: 'Apresentei uma palestra.',
    });
  });

  it('does not read a year that only appears later in the sentence', () => {
    expect(
      extractLogMarker('Programo há muito tempo, e em 2008 comecei.'),
    ).toBeNull();
  });
});

describe('the about page log', () => {
  const history = sectionEntries('Desde 2008');

  it('annotates every career entry with only its stated years', () => {
    expect(history).toHaveLength(10);

    expect(
      history.map((entry) => {
        const { year, age } = extractLogMarker(entry) ?? {};
        return [year, age].filter(Boolean).join(' / ');
      }),
    ).toEqual([
      '2008–2012',
      '2012–2016',
      '2016–2017',
      '2016–2022',
      '2017–2021',
      '2021–2022',
      '2022–2023',
      '2023',
      '2024–2025',
      '2026',
    ]);
  });

  it('never derives an age, because no entry states one', () => {
    expect(
      history.every((entry) => extractLogMarker(entry)?.age === undefined),
    ).toBe(true);
  });

  it('starts at the year the profile says the computing started', () => {
    // `profile.computingSince` and the first entry are the same fact.
    expect(extractLogMarker(history[0])?.year?.slice(0, 4)).toBe(
      String(profile.computingSince),
    );
  });
});
