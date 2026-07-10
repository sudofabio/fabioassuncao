import type { MaybeRefOrGetter } from "vue";

const SITE_NAME = "Fábio Assunção";
const DEFAULT_TITLE = "Fábio Assunção — Software Engineer";
const FALLBACK_URL = "https://fabioassuncao.com";

export interface PageSeoOptions {
  /**
   * Título da página, sem sufixo — o `titleTemplate` global acrescenta
   * "· Fábio Assunção". Omitido = título default do site.
   */
  title?: MaybeRefOrGetter<string>;
  description: MaybeRefOrGetter<string>;
  /** Caminho canônico da rota (ex.: '/presentations/<slug>'). */
  path: string;
  /** Default 'website'. */
  type?: "website" | "article";
  /** Override do og:locale (ex.: 'pt_BR' para conteúdo em português). */
  ogLocale?: string;
}

/**
 * Meta de SEO por página: title, description, canonical e og/twitter
 * coerentes entre si. Centraliza o padrão para toda página nova — o head
 * global (`app.vue`) fica só com os fallbacks e dados do autor.
 */
export function usePageSeo(options: PageSeoOptions) {
  const site = useSiteConfig();
  const base = (site?.url ?? FALLBACK_URL).replace(/\/$/, "");
  const url = options.path === "/" ? `${base}/` : `${base}${options.path}`;

  // og/twitter não passam pelo titleTemplate — o sufixo é aplicado aqui.
  const fullTitle = () => {
    const title = options.title ? toValue(options.title) : undefined;
    return title ? `${title} · ${SITE_NAME}` : DEFAULT_TITLE;
  };

  useSeoMeta({
    ...(options.title ? { title: options.title } : {}),
    description: options.description,
    ogTitle: fullTitle,
    ogDescription: options.description,
    ogUrl: url,
    ogType: options.type ?? "website",
    ...(options.ogLocale ? { ogLocale: options.ogLocale } : {}),
    twitterTitle: fullTitle,
    twitterDescription: options.description,
  });

  useHead({
    link: [{ rel: "canonical", href: url }],
  });
}
