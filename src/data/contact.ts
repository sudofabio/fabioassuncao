import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faGithub } from '@fortawesome/free-brands-svg-icons/faGithub';
import { faInstagram } from '@fortawesome/free-brands-svg-icons/faInstagram';
import { faLinkedinIn } from '@fortawesome/free-brands-svg-icons/faLinkedinIn';
import { faThreads } from '@fortawesome/free-brands-svg-icons/faThreads';
import { faTiktok } from '@fortawesome/free-brands-svg-icons/faTiktok';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons/faWhatsapp';
import { faXTwitter } from '@fortawesome/free-brands-svg-icons/faXTwitter';
import { faYoutube } from '@fortawesome/free-brands-svg-icons/faYoutube';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons/faEnvelope';

import profile from './profile.json';

export type ContactId =
  | 'whatsapp'
  | 'linkedin'
  | 'github'
  | 'instagram'
  | 'youtube'
  | 'tiktok'
  | 'threads'
  | 'x'
  | 'email';

export interface ContactItem {
  id: ContactId;
  link: string;
  label: string;
  icon: IconDefinition;
}

/** Número público do WhatsApp, só dígitos com DDI, no formato do wa.me. */
export const WHATSAPP_NUMBER = '5598985643922';

/** Mensagem inicial sugerida em todo link de WhatsApp do site. */
export const WHATSAPP_GREETING =
  'Olá, Fábio! Vim pelo seu site e gostaria de conversar.';

export function whatsappLink(text: string = WHATSAPP_GREETING): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

/**
 * Perfil no Threads. Vazio enquanto o endereço não for confirmado; entradas
 * sem link não são publicadas. TODO(fabio): confirmar o perfil no Threads.
 */
export const THREADS_URL = '';

const all: ContactItem[] = [
  {
    id: 'whatsapp',
    link: whatsappLink(),
    label: 'WhatsApp',
    icon: faWhatsapp,
  },
  {
    id: 'linkedin',
    link: 'https://www.linkedin.com/in/fabioassuncao',
    label: 'LinkedIn',
    icon: faLinkedinIn,
  },
  {
    id: 'github',
    link: 'https://github.com/fabioassuncao',
    label: 'GitHub',
    icon: faGithub,
  },
  {
    id: 'instagram',
    link: 'https://www.instagram.com/fabioassuncaohq',
    label: 'Instagram',
    icon: faInstagram,
  },
  {
    id: 'youtube',
    link: 'https://www.youtube.com/@fabioassuncaohq',
    label: 'YouTube',
    icon: faYoutube,
  },
  {
    id: 'tiktok',
    link: 'https://www.tiktok.com/@fabioassuncaohq',
    label: 'TikTok',
    icon: faTiktok,
  },
  {
    id: 'threads',
    link: THREADS_URL,
    label: 'Threads',
    icon: faThreads,
  },
  {
    id: 'x',
    link: 'https://x.com/fabioassuncaohq',
    label: 'X',
    icon: faXTwitter,
  },
  {
    id: 'email',
    // One public address, shared with the contact CTA and JSON-LD.
    link: `mailto:${profile.email}`,
    label: 'E-mail',
    icon: faEnvelope,
  },
];

const data: ContactItem[] = all.filter((item) => item.link !== '');

/** Ids that are conversation channels rather than public profiles. */
const NOT_PROFILES: ReadonlySet<ContactId> = new Set(['email', 'whatsapp']);

/** Public profiles about the person, for JSON-LD `sameAs` and résumé data. */
export const profileLinks: ContactItem[] = data.filter(
  (item) => !NOT_PROFILES.has(item.id),
);

export default data;
