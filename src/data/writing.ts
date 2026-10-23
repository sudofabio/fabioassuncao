export interface WritingItem {
  title: string;
  url: string;
  date: string;
  description: string;
}

// Artigos publicados fora do site (Medium, LinkedIn, dev.to...), do mais novo
// para o mais antigo. TODO(fabio): incluir artigos externos, se houver.
const data: WritingItem[] = [];

export default data;
