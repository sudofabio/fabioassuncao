/**
 * What Fábio offers, grouped by what the client wants. Names and scopes come
 * from the social media project (`04-ofertas/catalogo-de-servicos.md`,
 * `05-perfis/site-fabio.md` §4); the codes (O1–O12) match that catalogue.
 *
 * Prices are deliberately absent: they await DECISOES 18 and a legal review.
 * Leave `price` undefined until then. This repository is public, so not even
 * the unapproved recommendations are kept here.
 * TODO(fabio): preencher `price` quando os valores públicos forem decididos.
 */
export interface Service {
  /** Catalogue code, e.g. `O1`. Not shown on the page. */
  code: string;
  name: string;
  summary: string;
  /** Public price text ("a partir de R$ …"). Undefined means not published. */
  price?: string;
}

export interface ServiceGroup {
  id: string;
  /** Completes "Para quem quer…". */
  need: string;
  services: Service[];
}

export const serviceGroups: ServiceGroup[] = [
  {
    id: 'construir',
    need: 'Construir um sistema',
    services: [
      {
        code: 'O7',
        name: 'Desenvolvimento sob medida',
        summary:
          'Plataformas, MVPs, integrações e apps, com proposta por escrito, ciclos de duas semanas que você valida e documentação no fim.',
      },
    ],
  },
  {
    id: 'planejar',
    need: 'Saber exatamente o que construir antes de investir',
    services: [
      {
        code: 'O10',
        name: 'Blueprint',
        summary:
          'Discovery técnico: escopo priorizado, arquitetura e estimativa de prazo e custo por fase. O documento é seu e o valor é abatido no projeto.',
      },
    ],
  },
  {
    id: 'ia',
    need: 'Usar IA de verdade no negócio',
    services: [
      {
        code: 'O8',
        name: 'Diagnóstico de IA',
        summary:
          'Mapa de oportunidades priorizado, incluindo o que não vale fazer com IA, e plano de 90 dias. Abatido na implementação.',
      },
      {
        code: 'O11',
        name: 'Agentes e automações',
        summary:
          'Solução em produção com limite de custo, registro e revisão humana nos pontos críticos.',
      },
      {
        code: 'O12',
        name: 'Palestras e workshops',
        summary:
          'Para times e lideranças que querem usar IA com critério: produtividade, riscos e o que não fazer.',
      },
    ],
  },
  {
    id: 'proteger',
    need: 'Proteger e atualizar o que já tem',
    services: [
      {
        code: 'O1',
        name: 'Raio-X de Segurança',
        summary:
          'Versões e falhas conhecidas, superfície exposta, configuração, acessos, dependências e amostragem de código nos pontos críticos.',
      },
      {
        code: 'O2',
        name: 'Revisão de app feito com IA',
        summary:
          'Para app criado com Lovable, Bolt, Cursor e afins antes de receber dado real: regras de acesso, segredos, autenticação e custos de IA.',
      },
      {
        code: 'O3',
        name: 'Atualização emergencial',
        summary:
          'Sair de versão sem suporte ou com falha crítica, sem mudar funcionalidade, com plano de reversão.',
      },
      {
        code: 'O4',
        name: 'Modernização de legado',
        summary:
          'Correções e modernização em ciclos validados, com testes e documentação.',
      },
    ],
  },
  {
    id: 'senior',
    need: 'Ter um sênior do lado',
    services: [
      {
        code: 'O6',
        name: 'CTO sob demanda',
        summary:
          'Direção técnica em arquitetura, nuvem, fornecedores, IA e segurança, com horas mensais combinadas.',
      },
      {
        code: 'O9',
        name: 'Mentoria 1:1',
        summary:
          'Três meses para devs e tech leads, ou para empresários e gestores que precisam decidir sobre tecnologia.',
      },
    ],
  },
];

/** The commitments printed under every list of services. */
export const SERVICES_NOTE =
  'Projetos executados com a minha equipe na Codions · proposta por escrito · NDA desde o início · código e documentação são seus';
