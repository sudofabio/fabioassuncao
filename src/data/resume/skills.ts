export interface Skill {
  title: string;
  /**
   * Self-assessed 1–5 score. Optional: without it the tag is shown with no
   * proficiency tier instead of an invented one.
   * TODO(fabio): informar o nível (1–5) de cada competência, se quiser exibir.
   */
  competency?: number;
  category: string[];
}

export interface Category {
  name: string;
}

// Os quatro grupos de competências do site anterior, na mesma ordem de itens.
const skills: Skill[] = [
  // Backend
  {
    title: 'PHP',
    category: ['Backend'],
  },
  {
    title: 'Go',
    category: ['Backend'],
  },
  {
    title: 'Node.js',
    category: ['Backend'],
  },
  {
    title: 'TypeScript',
    category: ['Backend'],
  },
  {
    title: 'Python',
    category: ['Backend'],
  },
  {
    title: 'Rust',
    category: ['Backend'],
  },
  {
    title: 'SQL',
    category: ['Backend'],
  },
  // Arquitetura
  {
    title: 'Microsserviços',
    category: ['Arquitetura'],
  },
  {
    title: 'Event-Driven',
    category: ['Arquitetura'],
  },
  {
    title: 'REST / GraphQL',
    category: ['Arquitetura'],
  },
  {
    title: 'Domain-Driven Design',
    category: ['Arquitetura'],
  },
  {
    title: 'CQRS',
    category: ['Arquitetura'],
  },
  // Cloud & DevOps
  {
    title: 'AWS',
    category: ['Cloud & DevOps'],
  },
  {
    title: 'GCP',
    category: ['Cloud & DevOps'],
  },
  {
    title: 'Cloudflare',
    category: ['Cloud & DevOps'],
  },
  {
    title: 'Docker',
    category: ['Cloud & DevOps'],
  },
  {
    title: 'Kubernetes',
    category: ['Cloud & DevOps'],
  },
  {
    title: 'Terraform',
    category: ['Cloud & DevOps'],
  },
  {
    title: 'CI/CD',
    category: ['Cloud & DevOps'],
  },
  // Engenharia
  {
    title: 'Git',
    category: ['Engenharia'],
  },
  {
    title: 'Linux',
    category: ['Engenharia'],
  },
  {
    title: 'Testes',
    category: ['Engenharia'],
  },
  {
    title: 'Observabilidade',
    category: ['Engenharia'],
  },
  {
    title: 'Performance',
    category: ['Engenharia'],
  },
  {
    title: 'Segurança',
    category: ['Engenharia'],
  },
].map((skill) => ({ ...skill, category: skill.category.sort() }));

/**
 * The distinct category names, sorted, so the filter row and the group order
 * both fall out of the skill list itself.
 */
function buildCategories(skillsList: Skill[]): Category[] {
  const uniqueCategories = Array.from(
    new Set(skillsList.flatMap(({ category }) => category)),
  ).sort();

  return uniqueCategories.map((category) => ({ name: category }));
}

const categories: Category[] = buildCategories(skills);

export { categories, skills };
