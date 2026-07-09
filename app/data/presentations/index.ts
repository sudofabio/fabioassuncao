import type { Bilingual } from "~/types";

export interface PresentationEntry {
  slug: string;
  title: string;
  event: string;
  dateLabel: Bilingual;
  description: Bilingual;
}

/** Registro das apresentações publicadas em /presentations/<slug>. */
export const presentations: PresentationEntry[] = [
  {
    slug: "alem-do-codigo-inteligencia-artificial-e-o-novo-desenvolvedor",
    title: "Além do código: Inteligência artificial e o novo desenvolvedor",
    event: "10º Talk — Vale do Pindaré Tech · IFMA Santa Inês/MA",
    dateLabel: {
      pt: "jul/2026",
      en: "Jul 2026",
    },
    description: {
      pt: "A evolução do mercado, a comoditização do código e o novo papel do desenvolvedor na era da IA.",
      en: "Market evolution, code commoditization, and the developer's new role in the AI era.",
    },
  },
];
