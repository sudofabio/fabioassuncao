import type { Position } from '@/data/resume/work';
import { type DateInput, formatDuration, monthsBetween } from '@/lib/career';
import dayjs from '@/lib/dayjs';

import JobSummary from './JobSummary';

/** How much weight a role carries on the timeline spine. */
export type JobTier = 'lead' | 'primary' | 'early';

interface JobProps {
  data: Position;
  tier?: JobTier;
  /** Instant an ongoing role is measured to; the parent owns the clock read. */
  now: DateInput;
}

export default function Job({ data, tier = 'primary', now }: JobProps) {
  const {
    name,
    position,
    url,
    startDate,
    endDate,
    datePrecision,
    summary,
    highlights,
  } = data;
  // A year-only record shows the year alone; inventing a month would be a
  // claim the data never made.
  const dateFormat = datePrecision === 'year' ? 'YYYY' : 'MMMM [de] YYYY';
  const isCurrent = !endDate;
  const months = monthsBetween(startDate, endDate ?? now);
  // An ongoing tenure is a build-time floor, but "<1 mo" is already an upper bound.
  const hedged = isCurrent && months >= 1;
  const duration = `${formatDuration(months)}${hedged ? '+' : ''}`;
  const durationLong = `${formatDuration(months, true)}${hedged ? ' ou mais' : ''}`;

  return (
    <article
      className={`jobs-container jobs-container--${tier}${
        isCurrent ? ' jobs-container--current' : ''
      }`}
    >
      <span className="job-marker" aria-hidden="true" />

      <p className="daterange">
        <time dateTime={startDate}>{dayjs(startDate).format(dateFormat)}</time>
        {/* The dash is decorative, so a screen reader would otherwise run the
            dates together as "2022 Atual". */}
        <span className="daterange-sep" aria-hidden="true">
          –
        </span>
        <span className="sr-only"> até </span>
        {endDate ? (
          <time dateTime={endDate}>{dayjs(endDate).format(dateFormat)}</time>
        ) : (
          <span className="daterange-present">Atual</span>
        )}
        {/* Month-level tenure from year-only dates would be false precision. */}
        {datePrecision === 'year' ? null : (
          <span className="daterange-duration">
            <span aria-hidden="true">{duration}</span>
            <span className="sr-only">Duração: {durationLong}</span>
          </span>
        )}
      </p>

      <div className="job-body">
        <header>
          <h3>
            {name && url ? (
              <a href={url} className="job-company">
                {name}
              </a>
            ) : null}
            {name && !url ? <span className="job-company">{name}</span> : null}
            <span className="job-position">{position}</span>
          </h3>
        </header>
        {summary ? <JobSummary summary={summary} /> : null}
        {highlights ? (
          <ul className="points">
            {highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  );
}
