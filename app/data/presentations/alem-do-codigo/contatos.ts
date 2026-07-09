/**
 * Contatos oficiais — exatamente como em PALESTRANTE/README.md (regra inviolável).
 * QR code gerado dinamicamente (qrcode.vue) a partir da URL da apresentação.
 */

export const PALESTRANTE = {
  nome: 'Fábio Assunção',
  minibio:
    'Desenvolvedor de software, Tech Lead e empreendedor, com mais de 15 anos de experiência em backend, arquitetura de sistemas, cloud computing e liderança técnica. Atua na construção de soluções escaláveis, conectando engenharia, produto e negócio.',
  foto: '/presentations/alem-do-codigo/photo.jpeg',
}

export const CONTATOS = [
  { rotulo: 'fabioassuncao.com', tipo: 'site' },
  { rotulo: 'github.com/fabioassuncao', tipo: 'github' },
  { rotulo: 'linkedin.com/in/fabioassuncao', tipo: 'linkedin' },
  { rotulo: 'contato@fabioassuncao.com', tipo: 'email' },
] as const

/** URL da apresentação — destino do QR protagonista do slide 26. */
export const URL_APRESENTACAO =
  'https://fabioassuncao.com/presentations/alem-do-codigo-inteligencia-artificial-e-o-novo-desenvolvedor'

export const EVENTO = {
  lockup: '10º TALK — VALE DO PINDARÉ TECH',
  local: 'IFMA Campus Santa Inês',
  dataEvento: '10 de julho',
}
