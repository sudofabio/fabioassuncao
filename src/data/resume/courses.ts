export interface Course {
  title: string;
  number: string;
  link: string;
  /**
   * Must match a `Degree.school` in `src/data/resume/degrees.ts` exactly.
   * `src/lib/resumeJson.ts` files coursework under the education entry with
   * this name, and it compares the two strings whole — a shortened form here
   * would silently drop the courses from `/resume.json`.
   */
  university: string;
}

// TODO(fabio): informar cursos e certificações relevantes, se houver. Enquanto
// a lista estiver vazia, a seção não aparece no currículo.
const courses: Course[] = [];

export default courses;
