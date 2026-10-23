/**
 * Based on the JSON Resume work item, with local `commitment` and
 * `datePrecision` extensions.
 *
 * TODO(fabio): informar a empresa (e o link) de cada cargo e se o empregador e
 * os órgãos públicos atendidos podem ser citados. Até lá `name`/`url` ficam de
 * fora e a página mostra só o cargo.
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

const work: Position[] = [
  {
    position: 'Engenheiro de Software Sênior / Arquiteto Cloud',
    startDate: '2022-01-01',
    datePrecision: 'year',
    summary:
      'Arquitetura de sistemas distribuídos, microsserviços e infraestrutura cloud com foco em escalabilidade e resiliência.',
  },
  {
    position: 'Engenheiro de Software Backend',
    startDate: '2019-01-01',
    endDate: '2022-01-01',
    datePrecision: 'year',
    summary:
      'Desenvolvimento de APIs de alta performance, integração de sistemas e automação de pipelines CI/CD.',
  },
  {
    position: 'Desenvolvedor Full Stack',
    startDate: '2016-01-01',
    endDate: '2019-01-01',
    datePrecision: 'year',
    summary:
      'Aplicações web completas com PHP, JavaScript e frameworks modernos. Primeiras experiências com containers e cloud.',
  },
  {
    position: 'Desenvolvedor Web',
    startDate: '2014-01-01',
    endDate: '2016-01-01',
    datePrecision: 'year',
    summary:
      'Desenvolvimento de sistemas web, e-commerce e integração com APIs de pagamento e logística.',
  },
  {
    position: 'Desenvolvedor PHP',
    startDate: '2012-01-01',
    endDate: '2014-01-01',
    datePrecision: 'year',
    summary:
      'Construção de aplicações web com PHP e MySQL. Introdução a boas práticas e padrões de projeto.',
  },
  {
    position: 'Desenvolvedor Júnior',
    startDate: '2010-01-01',
    endDate: '2012-01-01',
    datePrecision: 'year',
    summary:
      'Manutenção de sistemas legados e desenvolvimento de pequenas aplicações web.',
  },
  {
    position: 'Estagiário de Desenvolvimento',
    startDate: '2008-01-01',
    endDate: '2010-01-01',
    datePrecision: 'year',
    summary:
      'Primeiros passos em programação, suporte técnico e desenvolvimento de scripts de automação.',
  },
];

export default work;
