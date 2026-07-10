/**
 * Bloco "O mapa da IA" (slides D1–D5) — contextualização acessível para
 * público misto (iniciantes + devs). Definições curtas e verificadas.
 * Logos locais em /presentations/alem-do-codigo/logos/.
 */

const LOGOS = '/presentations/alem-do-codigo/logos'

/** D2 — Quem é quem: provedores dos modelos-base e suas famílias. */
export interface Provedor {
  nome: string
  logo: string
  modelos: string
  tag: string
}

export const PROVEDORES: Provedor[] = [
  { nome: 'OpenAI', logo: `${LOGOS}/openai.svg`, modelos: 'ChatGPT · GPT · Codex', tag: 'fechado' },
  { nome: 'Anthropic', logo: `${LOGOS}/anthropic.svg`, modelos: 'Claude: Opus · Sonnet · Haiku', tag: 'fechado' },
  { nome: 'Google', logo: `${LOGOS}/google.svg`, modelos: 'Gemini · Antigravity', tag: 'fechado' },
  { nome: 'Meta', logo: `${LOGOS}/meta.svg`, modelos: 'Llama', tag: 'aberto' },
  { nome: 'Mistral', logo: `${LOGOS}/mistral.svg`, modelos: 'Mistral · Mixtral', tag: 'aberto · europeu' },
]

/** D3 — Modelo × Ferramenta × Agente × Editor (analogia motor · carro · piloto). */
export interface Definicao {
  termo: string
  analogia: string
  descricao: string
  exemplos: string
  icon: string
}

export const DEFINICOES: Definicao[] = [
  { termo: 'Modelo', analogia: 'o motor', descricao: 'O cérebro que prevê o próximo token. Sozinho, não faz nada: precisa de um veículo.', exemplos: 'Claude · GPT · Gemini · Llama', icon: 'Cpu' },
  { termo: 'Ferramenta', analogia: 'as mãos', descricao: 'O que dá ações ao modelo: rodar comandos, ler arquivos, buscar na web, chamar APIs.', exemplos: 'terminal · navegador · MCP', icon: 'Wrench' },
  { termo: 'Editor', analogia: 'o carro', descricao: 'Onde você senta e dirige o modelo dentro do seu código, no dia a dia.', exemplos: 'VS Code · Cursor · Antigravity', icon: 'PanelsTopLeft' },
  { termo: 'Agente', analogia: 'o piloto automático', descricao: 'O modelo agindo em loop: planeja, executa, observa o resultado e corrige.', exemplos: 'Claude Code · Codex · Issue Flow', icon: 'Bot' },
]

/** D5 — O vocabulário novo (gancho para o bloco "Na prática"). */
export interface Conceito {
  termo: string
  resumo: string
  detalhe: string
  icon: string
}

export const VOCABULARIO: Conceito[] = [
  { termo: 'MCP', resumo: 'Model Context Protocol', detalhe: 'Padrão aberto que conecta o modelo a ferramentas e dados. A "porta USB-C" da IA.', icon: 'Cable' },
  { termo: 'Agent Skills', resumo: 'conhecimento empacotado', detalhe: 'Uma pasta com instruções que ensina o agente a executar uma tarefa repetível.', icon: 'Package' },
  { termo: 'Agentes', resumo: 'tudo junto, em fluxo', detalhe: 'Skills + modelo + ferramentas orquestrados num loop que roda sob supervisão.', icon: 'Workflow' },
  { termo: 'Subagentes', resumo: 'especialistas sob orquestração', detalhe: 'Agentes focados que o principal aciona para uma tarefa (pesquisar, testar, revisar), cada um no seu contexto, devolvendo só o resultado.', icon: 'Waypoints' },
]
