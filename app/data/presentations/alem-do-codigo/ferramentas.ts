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

/**
 * Grupo 2 — Editores com IA (o dia a dia dentro de uma base de código).
 * Os três compartilham o mesmo DNA: o VS Code (ver slide "3 editores, 1 DNA").
 */
export const FERRAMENTAS_EDITORES: Ferramenta[] = [
  { nome: 'VS Code + Copilot', logo: `${LOGOS}/vscode.svg` },
  { nome: 'Cursor', logo: `${LOGOS}/cursor.svg` },
  { nome: 'Antigravity', logo: `${LOGOS}/antigravity.svg` },
]

/** Grupo 3 — Agentes de terminal / CLI (automação profissional; onde o Issue Flow vive). */
export const FERRAMENTAS_ENGENHARIA: Ferramenta[] = [
  { nome: 'Claude Code', logo: `${LOGOS}/claude.svg` },
  { nome: 'Codex', logo: `${LOGOS}/codex.svg` },
  { nome: 'Gemini CLI', logo: `${LOGOS}/gemini.svg` },
]

/** Logos de plataformas / sistemas operacionais (slide 4). */
export const LOGOS_PLATAFORMAS = {
  android: `${LOGOS}/android.svg`,
  ios: `${LOGOS}/ios.svg`,
  windows: `${LOGOS}/windows.svg`,
  linux: `${LOGOS}/linux.svg`,
  macos: `${LOGOS}/macos.svg`,
  microsoft: `${LOGOS}/microsoft.svg`,
}

/** Logos de navegadores — card "Websites" (slide 4). */
export const LOGOS_NAVEGADORES = {
  chrome: `${LOGOS}/chrome.svg`,
  firefox: `${LOGOS}/firefox.svg`,
  edge: `${LOGOS}/edge.svg`,
  safari: `${LOGOS}/safari.svg`,
}

/** Logos de infraestrutura — card "Infraestrutura" (slide 4). */
export const LOGOS_INFRA = {
  docker: `${LOGOS}/docker.svg`,
  kubernetes: `${LOGOS}/kubernetes.svg`,
  linux: `${LOGOS}/linux.svg`,
}

/** Logos de automação / DevOps — card "Automações" (slide 4). */
export const LOGOS_AUTOMACAO = {
  linux: `${LOGOS}/linux.svg`,
  bash: `${LOGOS}/bash.svg`,
  git: `${LOGOS}/git.svg`,
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
