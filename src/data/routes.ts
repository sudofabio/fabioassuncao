import { AUTHOR_NAME } from '@/lib/utils';

export interface Route {
  label: string;
  path: string;
  index?: boolean;
  primary?: boolean;
}

const routes: Route[] = [
  {
    index: true,
    label: AUTHOR_NAME,
    path: '/',
  },
  {
    label: 'Sobre',
    path: '/about',
  },
  {
    label: 'O que eu faço',
    path: '/trabalhe-comigo',
  },
  {
    label: 'Palestras',
    path: '/presentations',
  },
  {
    label: 'Artigos',
    path: '/writing',
  },
  {
    label: 'Projetos',
    path: '/projects',
  },
  {
    label: 'Currículo',
    path: '/resume',
  },
  {
    label: 'Contato',
    path: '/contato',
  },
  // Antes escondida no rodapé; palestras são parte da autoridade pública.
];

export default routes;
