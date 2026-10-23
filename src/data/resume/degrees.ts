export interface Degree {
  degree: string;
  /** Omitted until confirmed; the entry then shows the degree alone. */
  school?: string;
  link?: string;
  year?: number;
}

// Source: `01-contexto/fabio.md` (Bacharel em Ciência da Computação) and the
// education highlight on LinkedIn (Faculdade Pitágoras), as recorded in the
// social media project.
// TODO(fabio): confirmar a instituição e informar o ano de conclusão.
const degrees: Degree[] = [
  {
    degree: 'Bacharelado em Ciência da Computação',
    school: 'Faculdade Pitágoras',
  },
];

export default degrees;
