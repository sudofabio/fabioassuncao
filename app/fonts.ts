import localFont from 'next/font/local';

/**
 * The brand's two families (social media project, `08-producao/identidade-
 * visual/brand-book.md`): Archivo for every word, IBM Plex Mono for technical
 * labels. Fontsource supplies versioned files through npm; next/font/local
 * self-hosts them without contacting Google during the build. Keep these on
 * the Latin files so a family does not preload every script Fontsource ships.
 *
 * vinext preloads every face declared through next/font on every page, so
 * only faces that every page renders belong here (see AGENTS.md, Fonts).
 */
export const archivo = localFont({
  src: '../node_modules/@fontsource-variable/archivo/files/archivo-latin-wght-normal.woff2',
  variable: '--font-archivo',
  weight: '100 900',
  style: 'normal',
  display: 'swap',
  fallback: ['Helvetica Neue', 'Arial'],
  adjustFontFallback: 'Arial',
});

/** Static, not variable: Plex Mono ships per weight, and labels use two. */
export const plexMono = localFont({
  src: [
    {
      path: '../node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2',
      weight: '500',
      style: 'normal',
    },
  ],
  variable: '--font-plex-mono',
  display: 'swap',
  fallback: ['SFMono-Regular', 'Consolas'],
  adjustFontFallback: false,
});
