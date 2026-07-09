/**
 * Demo do slide 15 — "Prompt cru vs. Especificação".
 * Exemplo AUTORAL criado para esta palestra (regra inviolável: sem
 * repositórios externos). Mini-spec de um app de tarefas.
 */

export const PROMPT_CRU = {
  titulo: 'PROMPT CRU',
  comando: 'faça um app de tarefas',
  resultado: [
    'stack aleatória, sem padrão de projeto',
    'autenticação fraca (senha em texto puro)',
    'zero testes, zero validação de dados',
    'dívida técnica embutida desde a 1ª linha',
  ],
  veredito: 'Funciona na demo. Quebra no mundo real.',
}

export const SPEC_ESTRUTURADA = {
  titulo: 'ESPECIFICAÇÃO',
  linhas: [
    { chave: 'objetivo', valor: 'gestão de tarefas p/ equipes pequenas' },
    { chave: 'stack', valor: 'Nuxt 4 + PostgreSQL + Cloudflare' },
    { chave: 'requisitos', valor: 'auth OAuth2 · CRUD · filtros · offline' },
    { chave: 'regras', valor: 'tarefa pertence a 1 projeto · soft delete' },
    { chave: 'segurança', valor: 'LGPD · rate limit · logs de auditoria' },
    { chave: 'critérios', valor: 'testes ≥ 80% · p95 < 300ms · a11y AA' },
  ],
  resultado: [
    'código aderente à stack do time',
    'regras de negócio respeitadas',
    'testável, evoluível, auditável',
    'pronto para revisão profissional',
  ],
  veredito: 'É assim que times maduros trabalham hoje.',
}
