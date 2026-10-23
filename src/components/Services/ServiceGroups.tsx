import { SERVICES_NOTE, serviceGroups } from '@/data/services';

interface ServiceGroupsProps {
  /** Names only, for the homepage; the full page adds each summary. */
  compact?: boolean;
  headingLevel?: 'h2' | 'h3';
}

/**
 * The five "para quem quer…" blocks. A price renders only once it is set in
 * `src/data/services.ts`; none is published yet (DECISOES 18).
 */
export default function ServiceGroups({
  compact = false,
  headingLevel = 'h3',
}: ServiceGroupsProps) {
  const Heading = headingLevel;

  return (
    <div
      className={`service-groups${compact ? ' service-groups--compact' : ''}`}
    >
      <ol className="service-group-list">
        {serviceGroups.map((group) => (
          <li key={group.id} id={group.id} className="service-group">
            <p className="service-need">Para quem quer</p>
            <Heading className="service-group-title">{group.need}</Heading>
            <ul className="service-list">
              {group.services.map((service) => (
                <li key={service.code} className="service">
                  <span className="service-name">{service.name}</span>
                  {compact ? null : (
                    <span className="service-summary">{service.summary}</span>
                  )}
                  {service.price ? (
                    <span className="service-price">{service.price}</span>
                  ) : null}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
      <p className="service-note">{SERVICES_NOTE}</p>
    </div>
  );
}
