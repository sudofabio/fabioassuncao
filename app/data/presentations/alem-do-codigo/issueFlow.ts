/**
 * Slide "Issue Flow na prática" (bloco Na prática) — do problema ao PR.
 * Baseado em DEMO_PRATICA_ISSUE_FLOW.md. REGRA: apenas comandos/skills
 * CONFIRMADOS na doc oficial (§7). Não inventar flags nem comandos.
 */

export interface NoPipeline {
  id: string
  rotulo: string
  at: number
  loop?: boolean
}

/** Pipeline conceitual: issue → prd → plan → execute → review⟳ → pr. */
export const PIPELINE: NoPipeline[] = [
  { id: 'issue', rotulo: 'issue', at: 1 },
  { id: 'prd', rotulo: 'prd', at: 2 },
  { id: 'plan', rotulo: 'plan', at: 3 },
  { id: 'execute', rotulo: 'execute', at: 4 },
  { id: 'review', rotulo: 'review', at: 5, loop: true },
  { id: 'pr', rotulo: 'pr', at: 6 },
]

export interface LinhaTerminal {
  at: number
  kind: 'cmd' | 'ok' | 'run' | 'fail' | 'pass'
  txt: string
}

/** Log do terminal — mockup §11, somente comandos confirmados (§7). */
export const LINHAS_TERMINAL: LinhaTerminal[] = [
  { at: 1, kind: 'cmd', txt: 'npx issue-flow generate --prompt "página /talks com cards"' },
  { at: 1, kind: 'ok', txt: '✓ issue #42 criada · "Add a talks listing page"' },
  { at: 2, kind: 'cmd', txt: 'npx issue-flow run 42 --mode auto' },
  { at: 2, kind: 'run', txt: '▸ prd        ✓  issues/42/prd.md' },
  { at: 3, kind: 'run', txt: '▸ plan       ✓  issues/42/tasks.json  (4 tarefas)' },
  { at: 4, kind: 'run', txt: '▸ execute    ⟳  story 3/4 …' },
  { at: 5, kind: 'fail', txt: '▸ review     ✗  FAIL → corrigindo (ciclo 1/3)' },
  { at: 5, kind: 'pass', txt: '▸ review     ✓  PASS' },
  { at: 6, kind: 'pass', txt: '▸ pr         ✓  PR #57 aberto' },
]

export interface EntradaArvore {
  at: number
  dep: number
  txt: string
  kind: 'folder' | 'ok' | 'run' | 'new' | 'warn' | 'pr'
  mark: string
}

/** Árvore de arquivos gerada (artefatos confirmados, §8). */
export const ARVORE_ISSUE: EntradaArvore[] = [
  { at: 1, dep: 0, txt: 'issues/42/', kind: 'folder', mark: '▸' },
  { at: 2, dep: 1, txt: 'prd.md', kind: 'ok', mark: '✓' },
  { at: 3, dep: 1, txt: 'tasks.json', kind: 'ok', mark: '✓' },
  { at: 4, dep: 1, txt: 'progress.txt', kind: 'run', mark: '⟳' },
  { at: 4, dep: 0, txt: 'app/pages/talks.vue', kind: 'new', mark: '＋' },
  { at: 5, dep: 1, txt: 'review-findings.md', kind: 'warn', mark: '⚠' },
  { at: 6, dep: 0, txt: 'PR #57 · aberto', kind: 'pr', mark: '✓' },
]
