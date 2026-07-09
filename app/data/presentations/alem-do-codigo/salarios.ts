/**
 * Dados salariais VALIDADOS na fonte (pesquisa.codigofonte.com.br, 08/07/2026).
 * Fonte: Pesquisa Salarial Código Fonte TV 2021–2026 (~11–18 mil respondentes/ano).
 * NÃO alterar/arredondar — conferidos número a número contra APRESENTACAO_BASE.md (slide 18).
 * Nota: em 2021 o nível "Especialista/Tech Lead" era agrupado como "Outro".
 * Série do Estágio omitida do gráfico (achata a escala): 1.323,68 → 2.586,84.
 */

export const ANOS = ['2021', '2022', '2023', '2024', '2025', '2026'] as const

export interface SerieSalarial {
  nivel: string
  valores: number[]
  crescimento: string
  cor: string
}

export const SERIES_SALARIAIS: SerieSalarial[] = [
  {
    nivel: 'Júnior',
    valores: [2955.93, 3658.92, 3987.43, 4079.01, 4154.21, 5060.34],
    crescimento: '+71%',
    cor: '#8FA3BF',
  },
  {
    nivel: 'Pleno',
    valores: [5594.11, 7387.42, 8023.44, 7850.47, 7840.74, 8466.52],
    crescimento: '+51%',
    cor: '#3ECF8E',
  },
  {
    nivel: 'Sênior',
    valores: [10601.42, 14399.46, 15510.34, 15050.46, 15635.35, 14607.85],
    crescimento: '+38%',
    cor: '#37C6F4',
  },
  {
    nivel: 'Especialista/Tech Lead',
    valores: [8745.12, 13012.34, 16339.29, 18202.92, 19290.08, 20601.64],
    crescimento: '+136%',
    cor: '#F2762E',
  },
]

/** Callout local: salário médio de dev no Maranhão (mesma pesquisa). */
export const MARANHAO = { de: 3719, para: 10047 }

/** Adoção de IA entre devs (Pesquisa Código Fonte TV 2026). */
export const ADOCAO_IA_2026 = 98.5

export const FONTE_SALARIOS =
  'Fonte: Pesquisa Salarial Código Fonte TV 2021–2026 (pesquisa.codigofonte.com.br) · em 2021, "Especialista" era agrupado como "Outro"'
