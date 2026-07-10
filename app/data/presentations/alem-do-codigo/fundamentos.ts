/**
 * Slide "Fundamentos concretos" (§5.3) — 4 grupos reais que a IA NÃO dispensa,
 * na metáfora camada volátil × camada permanente. + ponteiro roadmap.sh (§5.4).
 */

const LOGOS = '/presentations/alem-do-codigo/logos'

export interface GrupoFundamento {
  titulo: string
  oque: string
  porqueIA: string
  logos: string[]
  icon: string
}

export const GRUPOS_FUNDAMENTOS: GrupoFundamento[] = [
  {
    titulo: 'Máquina & terminal',
    oque: 'Linux · shell · sistema operacional',
    porqueIA: 'O agente roda comandos. Se você não lê a saída do terminal, não sabe se ele acertou.',
    logos: [`${LOGOS}/linux.svg`, `${LOGOS}/bash.svg`],
    icon: 'SquareTerminal',
  },
  {
    titulo: 'Versionamento',
    oque: 'Git · GitHub · branch · PR',
    porqueIA: 'O fluxo de IA é issue → branch → PR → review. Sem git, você não participa dele.',
    logos: [`${LOGOS}/git.svg`, `${LOGOS}/github-copilot.svg`],
    icon: 'GitBranch',
  },
  {
    titulo: 'Web & integração',
    oque: 'HTTP · APIs · REST · auth',
    porqueIA: 'A IA gera o endpoint; você confere o status code, o CORS e o token.',
    logos: [],
    icon: 'Globe',
  },
  {
    titulo: 'Empacotamento & entrega',
    oque: 'Docker · cloud · deploy · logs',
    porqueIA: 'A IA escreve o app. Ela não sabe por que o container não sobe nem lê o log das 2h por você.',
    logos: [`${LOGOS}/docker.svg`, `${LOGOS}/aws.svg`, `${LOGOS}/azure.svg`, `${LOGOS}/gcp.svg`],
    icon: 'Container',
  },
]

export const ROADMAP_SH = {
  url: 'roadmap.sh',
  label: 'o mapa de estudos — uma recomendação, não conteúdo',
  logo: `${LOGOS}/roadmap-sh.svg`,
}
