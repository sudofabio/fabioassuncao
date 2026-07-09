/**
 * Ecossistema de ferramentas (slide 9) — SOMENTE as listadas no documento
 * mestre (APRESENTACAO_BASE.md). Logos locais em /presentations/alem-do-codigo/logos/.
 */

const LOGOS = '/presentations/alem-do-codigo/logos'

export interface Ferramenta {
  nome: string
  logo: string
}

/** Grupo 1 — Prototipação & Vibe Coding (qualquer pessoa cria algo funcional). */
export const FERRAMENTAS_PROTOTIPACAO: Ferramenta[] = [
  { nome: 'Lovable', logo: `${LOGOS}/lovable.svg` },
  { nome: 'v0', logo: `${LOGOS}/v0.svg` },
  { nome: 'Replit', logo: `${LOGOS}/replit.svg` },
  { nome: 'Bolt', logo: `${LOGOS}/bolt.svg` },
]

/** Grupo 2 — Engenharia com IA (profissionais extraem o máximo). */
export const FERRAMENTAS_ENGENHARIA: Ferramenta[] = [
  { nome: 'Codex', logo: `${LOGOS}/codex.svg` },
  { nome: 'Claude Code', logo: `${LOGOS}/claude.svg` },
  { nome: 'Gemini CLI', logo: `${LOGOS}/gemini.svg` },
  { nome: 'Cursor', logo: `${LOGOS}/cursor.svg` },
  { nome: 'GitHub Copilot', logo: `${LOGOS}/github-copilot.svg` },
]

/** Logos de plataformas (slide 4). */
export const LOGOS_PLATAFORMAS = {
  android: `${LOGOS}/android.svg`,
  ios: `${LOGOS}/ios.svg`,
  linux: `${LOGOS}/linux.svg`,
  macos: `${LOGOS}/macos.svg`,
  microsoft: `${LOGOS}/microsoft.svg`,
}

/** Logos que alternam no topo da pirâmide (slide 24). */
export const LOGOS_FERRAMENTAS_PIRAMIDE = [
  { nome: 'Cursor', logo: `${LOGOS}/cursor.svg` },
  { nome: 'Claude Code', logo: `${LOGOS}/claude.svg` },
  { nome: 'v0', logo: `${LOGOS}/v0.svg` },
  { nome: 'Codex', logo: `${LOGOS}/codex.svg` },
  { nome: 'Gemini CLI', logo: `${LOGOS}/gemini.svg` },
]

export const LOGO_IFMA = `${LOGOS}/ifma.svg`
