/**
 * The public positioning and what Fábio talks about. Wording comes from the
 * social media project (`03-estrategia/posicionamento.md` and
 * `03-estrategia/pilares-e-frequencia.md`), where the same series names label
 * every video, so the site and the channels read as one voice.
 */

/** The one-line positioning, used in the about page and llms.txt. */
export const POSITIONING =
  'Engenheiro de software com mais de 15 anos de estrada que fala de IA, programação e segurança sem hype, com a régua de quem constrói e mantém sistema de verdade.';

/** The rule every piece of content follows. */
export const STANDARD = [
  {
    title: 'Fato com fonte',
    text: 'Manchete, número, documentação ou dado. Nunca "dizem que".',
  },
  {
    title: 'Leitura de quem viveu',
    text: 'O que eu vi acontecer em mais de 15 anos construindo e mantendo sistemas. O que eu não vivi, eu não conto como se tivesse vivido.',
  },
  {
    title: 'O que fazer',
    text: 'Um passo concreto, inclusive quando a resposta é "não faça nada" ou "depende".',
  },
] as const;

export interface Pillar {
  /** The series label, as it appears on the videos. */
  series: string;
  title: string;
  text: string;
  /** Matches the brand book's label colour for the series. */
  tone: 'signal' | 'cobalt' | 'risk' | 'ink';
}

export const pillars: Pillar[] = [
  {
    series: 'Sem Hype · IA',
    title: 'IA na prática',
    text: 'O que de fato muda com cada novidade, como empresas e devs usam IA de verdade e onde ela ainda erra.',
    tone: 'signal',
  },
  {
    series: 'Alerta · Segurança',
    title: 'Segurança',
    text: 'Falhas e incidentes explicados sem sirene, a parte técnica da LGPD e o que fazer amanhã.',
    tone: 'risk',
  },
  {
    series: 'Quanto Custa',
    title: 'Software e negócios',
    text: 'Quanto custa, como contratar, legado, nuvem, MVP e os erros caros que dá para evitar.',
    tone: 'signal',
  },
  {
    series: 'Na Prática',
    title: 'Como fazer',
    text: 'Checklists e demonstrações de IA, software e segurança aplicados.',
    tone: 'cobalt',
  },
  {
    series: 'Bastidor',
    title: 'Vivência',
    text: 'Histórias reais, decisões difíceis e erros que eu já vi, e cometi, sem expor clientes.',
    tone: 'ink',
  },
  {
    series: 'Dev Sênior',
    title: 'Para devs',
    text: 'Carreira, arquitetura e IA no dia a dia de quem programa.',
    tone: 'cobalt',
  },
];
