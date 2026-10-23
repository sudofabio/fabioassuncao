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
    label: 'Currículo',
    path: '/resume',
  },
  // Was labelled "Archive" and kept out of the nav, which left the register of
  // shipped work reachable only through the footer — and `/contact` hides the
  // footer, so from there it was unreachable entirely.
  {
    label: 'Projetos',
    path: '/projects',
  },
  {
    label: 'Artigos',
    path: '/writing',
  },
  // Antes escondida no rodapé; palestras são parte da autoridade pública.
  {
    label: 'Palestras',
    path: '/presentations',
  },
  {
    label: 'Trabalhe comigo',
    path: '/trabalhe-comigo',
  },
  {
    label: 'Contato',
    path: '/contact',
  },
  // A página de bio é o destino dos links das redes sociais, não da navegação.
  {
    label: 'Links',
    path: '/links',
    primary: false,
  },
];

export default routes;
