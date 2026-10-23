import type { Degree as DegreeType } from '@/data/resume/degrees';

interface DegreeProps {
  data: DegreeType;
}

export default function Degree({ data }: DegreeProps) {
  const { degree, school, link, year } = data;
  const schoolName =
    school && link ? <a href={link}>{school}</a> : (school ?? null);

  return (
    <article className="degree-container">
      <header>
        <h3 className="degree">{degree}</h3>
        {schoolName || year ? (
          <p className="school">
            {schoolName}
            {schoolName && year ? ', ' : null}
            {year ? <time dateTime={String(year)}>{year}</time> : null}
          </p>
        ) : null}
      </header>
    </article>
  );
}
