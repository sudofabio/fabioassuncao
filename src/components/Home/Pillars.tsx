import { type Pillar, pillars } from '@/data/pillars';

/** The series label, coloured as on the video covers (brand book, Séries). */
function SeriesTag({ pillar }: { pillar: Pillar }) {
  return (
    <span className={`series-tag series-tag--${pillar.tone}`}>
      {pillar.series}
    </span>
  );
}

/** "Sobre o que eu falo": the content pillars, one card each. */
export default function Pillars() {
  return (
    <section className="home-block" aria-labelledby="home-pillars-title">
      <header className="home-block-header">
        <p className="section-label">Nas redes</p>
        <h2 id="home-pillars-title">Sobre o que eu falo</h2>
        <p className="home-block-lede">
          Fato com fonte, leitura de quem viveu e o que fazer. Sem hype.
        </p>
      </header>
      <ul className="pillar-grid">
        {pillars.map((pillar) => (
          <li key={pillar.series} className="pillar-card">
            <SeriesTag pillar={pillar} />
            <h3>{pillar.title}</h3>
            <p>{pillar.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
