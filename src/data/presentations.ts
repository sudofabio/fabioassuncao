/**
 * Palestras e apresentações. O `slug` é a URL pública em
 * `/presentations/<slug>/` e nunca muda depois de publicado: o slide final de
 * cada palestra projeta um QR code para ele.
 */
export interface Presentation {
  slug: string;
  title: string;
  /** Evento, como o organizador o nomeia. */
  event: string;
  venue: string;
  city: string;
  /** ISO date da apresentação. */
  date: string;
  /** Uma frase, usada em listas e metadados. */
  description: string;
  /** Parágrafos do resumo exibido na página da palestra. */
  summary: string[];
  /** PDF dos slides em `public/`, quando houver. */
  slidesPdf?: string;
  /** Post do site que resume a palestra, quando houver. */
  postSlug?: string;
}

const presentations: Presentation[] = [
  {
    slug: 'alem-do-codigo-inteligencia-artificial-e-o-novo-desenvolvedor',
    title: 'Além do código: Inteligência artificial e o novo desenvolvedor',
    event: '10º Talk — Vale do Pindaré Tech',
    venue: 'IFMA Campus Santa Inês',
    city: 'Santa Inês/MA',
    date: '2026-07-10',
    description:
      'A evolução do mercado, a comoditização do código e o novo papel do desenvolvedor na era da IA.',
    summary: [
      'O que a inteligência artificial está fazendo de verdade com a profissão, sem hype e sem terrorismo. Escrever sintaxe deixou de ser o gargalo: código virou commodity, e o valor passou para quem sabe resolver problemas reais e garantir qualidade.',
      'A palestra percorre o vocabulário básico da IA (modelo, ferramenta, editor, agente, MCP e skills), o caminho do vibe coding ao Spec-Driven Development (SDD), uma demonstração do Issue Flow, os dados de mercado de 2021 a 2026 e uma visão crítica sobre demissões atribuídas à IA.',
      'A conclusão: a IA não elimina o desenvolvedor. Ela muda o papel — de digitador de código para arquiteto de soluções.',
    ],
    slidesPdf: '/presentations/alem-do-codigo/slides.pdf',
    postSlug: 'alem-do-codigo-ia-e-o-novo-desenvolvedor',
  },
];

/** Newest first. */
export function sortedPresentations(): Presentation[] {
  return [...presentations].sort((a, b) => b.date.localeCompare(a.date));
}

export function presentationPath(presentation: Presentation): string {
  return `/presentations/${presentation.slug}/`;
}

export default presentations;
