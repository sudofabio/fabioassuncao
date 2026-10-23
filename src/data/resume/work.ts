/**
 * Based on the JSON Resume work item, with local `commitment` and
 * `datePrecision` extensions.
 *
 * Source: the experience listed on Fábio's LinkedIn on 23/10/2026, as recorded
 * in the social media project (`01-contexto/ponto-de-partida.md` §2.3 and
 * `05-perfis/site-fabio.md` §5), with the approved highlights from
 * `01-contexto/fabio.md`. Client institutions appear as experience, never as
 * endorsement.
 */
export interface Position {
  /** Empresa. Omitida enquanto não for confirmada para publicação. */
  name?: string;
  position: string;
  url?: string;
  startDate: string;
  endDate?: string;
  /**
   * `year` when only the year is known. Dates are then stored as `YYYY-01-01`
   * so ordering and durations still work, but every reader shows the year
   * alone instead of inventing a month.
   */
  datePrecision?: 'year';
  /**
   * Marks an open-ended role that ran alongside the primary career. Omitted
   * means full-time; `sortPositions` uses this to keep an enduring side role
   * from outranking every later full-time position.
   */
  commitment?: 'part-time';
  summary?: string;
  highlights?: string[];
}

// The months below come from LinkedIn but have not been confirmed for
// publication, so every entry shows the year only (`datePrecision: 'year'`).
// TODO(fabio): confirmar os meses e então remover `datePrecision`.
const work: Position[] = [
  {
    name: 'Codions',
    position: 'Fundador e Engenheiro de Software Principal',
    url: 'https://codions.com',
    startDate: '2023-02-01',
    datePrecision: 'year',
    summary:
      'Conduzo projetos de software, segurança e modernização com a minha equipe na Codions, além de consultoria em arquitetura, nuvem e IA.',
  },
  {
    name: 'Iede (Portal QEdu)',
    position: 'Tech Lead',
    startDate: '2024-01-01',
    endDate: '2025-11-01',
    datePrecision: 'year',
    summary:
      'Liderei a tecnologia do Portal QEdu, com mais de 9,5 milhões de usuários.',
    highlights: [
      'Projetos com o MEC que impactaram mais de 3 milhões de estudantes e 57 mil docentes.',
      'Otimização de custos em AWS e GCP: redução média de cerca de 30%, com casos acima de 80%.',
    ],
  },
  {
    name: 'Zenvia',
    position: 'Senior Software Engineer',
    startDate: '2022-08-01',
    endDate: '2023-02-01',
    datePrecision: 'year',
  },
  {
    name: 'MPRJ (terceirizado)',
    position: 'Coordenador de desenvolvimento',
    startDate: '2021-04-01',
    endDate: '2022-04-01',
    datePrecision: 'year',
    summary: 'Coordenação de mais de 20 profissionais.',
  },
  {
    name: 'Codions',
    position: 'Fundador e coordenador de desenvolvimento',
    url: 'https://codions.com',
    startDate: '2016-04-01',
    endDate: '2022-09-01',
    datePrecision: 'year',
    summary:
      'Mais de 20 contratos públicos e privados, com equipes de até 17 desenvolvedores. Clientes como SEBRAE, MPRJ e Fecomércio-MA.',
  },
  {
    name: 'VAT Tecnologia (terceirizado)',
    position: 'Tech Lead',
    startDate: '2017-05-01',
    endDate: '2021-04-01',
    datePrecision: 'year',
    summary:
      'Auditoria técnica de arquitetura, código, segurança e escalabilidade.',
  },
  {
    name: 'Light Tecnologia',
    position: 'Consulting Software Engineer',
    startDate: '2016-06-01',
    endDate: '2017-04-01',
    datePrecision: 'year',
  },
  {
    name: 'VAT Tecnologia',
    position: 'Desenvolvedor web (júnior → sênior)',
    startDate: '2012-10-01',
    endDate: '2016-04-01',
    datePrecision: 'year',
  },
  {
    position: 'Desenvolvedor web freelancer',
    startDate: '2008-01-01',
    endDate: '2012-06-01',
    datePrecision: 'year',
    summary: 'Início da carreira.',
  },
];

export default work;
