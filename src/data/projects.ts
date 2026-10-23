/**
 * O registro do que eu construí.
 *
 * Dois grupos:
 *
 * - `shipped` — trabalho recente, com destino público para apontar.
 * - `archive` — projetos anteriores, mantidos como registro.
 *
 * Hoje os dois grupos são projetos open source públicos no GitHub. Datas são a
 * criação de cada repositório e as descrições traduzem a descrição do próprio
 * repositório — nada além do que está publicado lá.
 *
 * Uma entrada que declara `sourceWork` tem datas e números conferidos contra o
 * cargo correspondente em `src/data/resume/work.ts`.
 *
 * TODO(fabio): estudos de caso (problema, solução, resultado) dos trabalhos
 * mais relevantes, com o que puder ser publicado.
 */
export type ProjectStatus = 'shipped' | 'archive';

export interface Project {
  title: string;
  /** Role, venue, or one-line positioning. Rendered as a mono label. */
  subtitle?: string;
  /**
   * Public destination for the work. Entries without one are rendered as
   * visibly inert rather than as cards that look clickable and are not.
   */
  link?: string;
  /** Résumé role (by `position`) that backs an entry's dates and claims. */
  sourceWork?: string;
  /**
   * Screenshot, where one exists. Optional: the card and the register row are
   * both designed to read on type and rules alone, so a new entry does not
   * need art invented for it.
   */
  image?: string;
  /**
   * ISO date work on the project started, or a one-off shipped.
   * This is project activity, not necessarily a public launch date.
   */
  date: string;
  /** ISO date project activity ended. Omitted on one-offs and live work. */
  endDate?: string;
  /**
   * The project is still active. This is deliberately independent of the
   * historical role named by `subtitle`: a project can continue after an
   * acquisition or employment transition. Drives the amber `Present` reading
   * and is mutually exclusive with `endDate`.
   */
  ongoing?: boolean;
  desc: string;
  /** Technologies the résumé names for this work. Omitted when it names none. */
  tech?: string[];
  status: ProjectStatus;
}

/**
 * Hand-ordered, most recent activity first within each group. Live work leads,
 * then sorts by its own start date; finished work sorts by its end (or one-off)
 * date. `projects.test.ts` pins the complete comparator, including ties.
 */
const data: Project[] = [
  {
    title: 'agentskills',
    subtitle: 'Open source · GitHub',
    link: 'https://github.com/fabioassuncao/agentskills',
    date: '2026-04-14',
    desc: 'Coleção pessoal de Agent Skills para automatizar tarefas do dia a dia.',
    status: 'shipped',
  },
  {
    title: 'issue-flow',
    subtitle: 'Open source · GitHub',
    link: 'https://github.com/codions-archive/issue-flow',
    date: '2026-03-18',
    desc: 'Transforma uma issue em um Pull Request revisado, sem precisar acompanhar o processo passo a passo. Apresentado na palestra “Além do código”.',
    tech: ['TypeScript'],
    status: 'shipped',
  },
  {
    title: 'imgtool',
    subtitle: 'Open source · GitHub',
    link: 'https://github.com/fabioassuncao/imgtool',
    date: '2026-03-06',
    desc: 'Processador de imagens em lote para a linha de comando: um único script Bash, autocontido, que usa o ImageMagick 7 para comprimir, redimensionar e converter imagens recursivamente.',
    tech: ['Bash', 'ImageMagick'],
    status: 'shipped',
  },
  {
    title: 'frankenphp-wordpress',
    subtitle: 'Open source · GitHub',
    link: 'https://github.com/fabioassuncao/frankenphp-wordpress',
    date: '2026-02-11',
    desc: 'Imagem base com FrankenPHP, WordPress core, PHP 8.4, WP-CLI, mu-plugins e configurações do servidor.',
    tech: ['FrankenPHP', 'PHP', 'Docker'],
    status: 'shipped',
  },
  {
    title: 'Tutorial Claude Code',
    subtitle: 'Open source · GitHub',
    link: 'https://github.com/fabioassuncao/Tutorial-Claude-Code',
    date: '2025-09-01',
    desc: 'Tutoriais para usar Claude Code e agentes de IA no desenvolvimento de software com metodologia TDD. Cada tutorial é completo e otimizado para tecnologias específicas.',
    status: 'shipped',
  },
  {
    title: 'laravel-k8s',
    subtitle: 'Workshop · GitHub',
    link: 'https://github.com/fabioassuncao/laravel-k8s',
    date: '2024-01-08',
    desc: 'Projeto de demonstração do meu workshop de Laravel e Kubernetes, com deploy no Azure Kubernetes Service e no DigitalOcean Kubernetes.',
    tech: ['PHP', 'Laravel', 'Kubernetes'],
    status: 'archive',
  },
  {
    title: 'homelab-setup',
    subtitle: 'Open source · GitHub',
    link: 'https://github.com/fabioassuncao/homelab-setup',
    date: '2023-12-27',
    desc: 'Script que automatiza o setup de um servidor de homelab: atualização de pacotes, usuários, ferramentas (git, Docker e outras) e CapRover como PaaS com SSL e proxy reverso.',
    tech: ['Shell', 'Docker'],
    status: 'archive',
  },
  {
    title: 'WireHole',
    subtitle: 'Open source · GitHub',
    link: 'https://github.com/fabioassuncao/wirehole',
    date: '2023-12-23',
    desc: 'Projeto docker-compose que combina WireGuard, Pi-Hole e Unbound para implantar uma VPN completa ou em split-tunnel, com bloqueio de anúncios e mais privacidade e cache de DNS.',
    tech: ['Docker', 'WireGuard'],
    status: 'archive',
  },
  {
    title: 'azure-cluster-terraform',
    subtitle: 'Open source · GitHub',
    link: 'https://github.com/fabioassuncao/azure-cluster-terraform',
    date: '2023-09-08',
    desc: 'Setup Terraform para Docker Swarm no Azure.',
    tech: ['Terraform', 'Azure'],
    status: 'archive',
  },
  {
    title: 'docker-images',
    subtitle: 'Open source · GitHub',
    link: 'https://github.com/fabioassuncao/docker-images',
    date: '2018-01-22',
    desc: 'Imagens Docker para desenvolvimento.',
    tech: ['Docker'],
    status: 'archive',
  },
];

/**
 * Produtos que ainda não têm descrição nem link confirmados. Ficam fora da
 * página até serem completados e movidos para `data`.
 * TODO(fabio): descrição, link e data de início de cada produto.
 */
export const pendingProducts: Pick<Project, 'title' | 'subtitle'>[] = [
  { title: 'Brasil Data Hub', subtitle: 'Produto · Codions' },
  { title: 'Base Empresarial', subtitle: 'Produto · Codions' },
];

export default data;

/** The register: recent work, most recent first. */
export const shipped = data.filter((project) => project.status === 'shipped');

/** Earlier projects, most recent first. */
export const archive = data.filter((project) => project.status === 'archive');
