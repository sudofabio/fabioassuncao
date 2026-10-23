'use client';

import type { ReactNode } from 'react';

import { whatsappLink } from '@/data/contact';
import { onWhatsappClick } from '@/lib/analytics';

interface WhatsappLinkProps {
  children: ReactNode;
  className?: string;
  /** Pre-filled message; defaults to the site greeting. */
  text?: string;
}

/**
 * Every WhatsApp link on the site: opens in a new tab, says so to screen
 * readers, and reports a `Contact` event when the visitor has consented.
 */
export default function WhatsappLink({
  children,
  className,
  text,
}: WhatsappLinkProps) {
  return (
    <a
      href={whatsappLink(text)}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onWhatsappClick}
    >
      {children}
      <span className="sr-only"> (abre em nova aba)</span>
    </a>
  );
}
