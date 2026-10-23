import profile from '@/data/profile.json';

/** The address the link always resolves to. */
const CONTACT_ADDRESS = profile.email;
const [CONTACT_LOCAL_PART, CONTACT_DOMAIN] = CONTACT_ADDRESS.split('@');

/**
 * The public address, set large. The upstream template animated joke aliases
 * through the local part; that implied a catch-all mailbox this domain is not
 * known to have, so the real address simply stands.
 */
export default function EmailLink() {
  return (
    <div className="contact-email-container">
      <a href={`mailto:${CONTACT_ADDRESS}`} className="contact-email-link">
        <span className="contact-email-prefix">{CONTACT_LOCAL_PART}</span>
        <span className="contact-email-domain">@{CONTACT_DOMAIN}</span>
      </a>
    </div>
  );
}
