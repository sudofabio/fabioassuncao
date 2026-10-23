import type { Skill } from '@/data/resume/skills';
import { MAX_COMPETENCY } from '@/lib/utils';

interface SkillTagProps {
  data: Skill;
}

export type SkillTier = 'deep' | 'working' | 'familiar';

const TIER_DESCRIPTION: Record<SkillTier, string> = {
  deep: 'domínio profundo',
  working: 'domínio prático',
  familiar: 'familiaridade',
};

/**
 * The 1–5 score is a self-assessment, so it is reported at the precision it
 * has: a coarse tier, not a plotted value with an axis.
 */
export function knowledgeTier(competency: number): SkillTier {
  if (competency >= MAX_COMPETENCY) return 'deep';
  if (competency >= 4) return 'working';
  return 'familiar';
}

export default function SkillTag({ data }: SkillTagProps) {
  const { competency, title } = data;

  // No declared level means no tier: never imply a proficiency nobody stated.
  if (competency === undefined) {
    return (
      <span className="skill-tag">
        <span className="skill-tag-name">{title}</span>
      </span>
    );
  }

  const tier = knowledgeTier(competency);

  return (
    <span className={`skill-tag skill-tag--${tier}`}>
      <span className="skill-tag-name">{title}</span>
      <span className="sr-only">, {TIER_DESCRIPTION[tier]}</span>
    </span>
  );
}
