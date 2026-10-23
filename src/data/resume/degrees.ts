export interface Degree {
  school: string;
  degree: string;
  link: string;
  year: number;
}

// TODO(fabio): informar a formação acadêmica (instituição, curso, ano e link).
// Enquanto a lista estiver vazia, a seção não aparece no currículo.
const degrees: Degree[] = [];

export default degrees;
