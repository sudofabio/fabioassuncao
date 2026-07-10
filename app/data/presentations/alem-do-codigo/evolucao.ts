/**
 * Slide "Como chegamos até aqui" — a evolução do desenvolvedor com IA, do
 * Stack Overflow ao SDD. On-ramp narrativo que justifica o SDD.
 * Datas verificadas; hype tratado em linguagem profissional (§6.3).
 */

export interface EtapaEvolucao {
  ano: string
  titulo: string
  desc: string
  icon: string
  logos?: string[]
  atual?: boolean
}

export const ETAPAS_EVOLUCAO: EtapaEvolucao[] = [
  { ano: '~2008', titulo: 'Google + Stack Overflow', desc: 'a resposta estava num fórum, você copiava e adaptava', icon: 'Search', logos: ['google', 'stackoverflow'] },
  { ano: 'nov/2022', titulo: 'ChatGPT', desc: 'a resposta virou conversa (GPT-3.5)', icon: 'MessageSquare', logos: ['openai'] },
  { ano: '2023', titulo: 'Copilot & Cursor', desc: 'a IA entra no editor, o "ghost text"', icon: 'Code2', logos: ['github-copilot', 'cursor'] },
  { ano: 'fev/2025', titulo: 'Vibe Coding', desc: 'descrever a ideia e deixar a IA gerar o app', icon: 'Sparkles' },
  { ano: '2025', titulo: 'A onda de exageros', desc: 'promessas de "programar sem saber programar"', icon: 'Megaphone' },
  { ano: '2025', titulo: 'O amadurecimento', desc: 'boas práticas, revisão, engenharia de verdade', icon: 'ShieldCheck' },
  { ano: '2026', titulo: 'SDD', desc: 'a especificação guia a IA — a resposta madura', icon: 'FileCheck2', atual: true },
]

/** Caixa factual do Vibe Coding (§6.2) — origem e reconhecimento verificados. */
export const VIBE_CODING_FATO = {
  termo: '"Vibe Coding"',
  origem: 'cunhado por Andrej Karpathy no X · 02/02/2025',
  reconhecimento: 'Merriam-Webster (mar/2025) · Palavra do Ano do Collins (2025)',
  nuance: 'Nem todo desenvolvimento com IA é vibe coding — Simon Willison e Andrew Ng fazem essa distinção.',
}
