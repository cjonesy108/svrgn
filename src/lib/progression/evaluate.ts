import type { Domain, DomainLayer } from '../data/domains';
import type { RankDefinition, RankRequirement } from '../data/ranks';

export interface EarnedBadge {
  id: string;
  domainId: string;
}

export interface RankCheck {
  met: boolean;
  label: string;
  detail: string;
}

export interface RankSnapshot {
  current: RankDefinition | null;
  next: RankDefinition | null;
  /** Requirements for the next rank, or for the current rank when there is no next rank. */
  checks: RankCheck[];
  earnedCount: number;
}

function countByDomain(earned: EarnedBadge[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const badge of earned) {
    counts.set(badge.domainId, (counts.get(badge.domainId) ?? 0) + 1);
  }
  return counts;
}

function layerDomains(domains: Domain[], layer: DomainLayer): Domain[] {
  return domains.filter((domain) => domain.layer === layer);
}

export function checkRequirement(
  requirement: RankRequirement,
  input: {
    assessmentCompleted: boolean;
    earned: EarnedBadge[];
    domains: Domain[];
  },
): RankCheck {
  if (requirement.kind === 'assessment') {
    return {
      met: input.assessmentCompleted,
      label: 'Complete the intake',
      detail: input.assessmentCompleted ? 'Intake is on file.' : 'The intake is the gate for Initiate.',
    };
  }

  if (requirement.kind === 'badgeCount') {
    return {
      met: input.earned.length >= requirement.min,
      label: `${requirement.min} badges`,
      detail: `${input.earned.length} of ${requirement.min} completed.`,
    };
  }

  if (requirement.kind === 'layerCount') {
    const ids = new Set(layerDomains(input.domains, requirement.layer).map((domain) => domain.id));
    const count = input.earned.filter((badge) => ids.has(badge.domainId)).length;
    const name = requirement.layer === 'civic' ? 'civic' : 'personal';
    return {
      met: count >= requirement.min,
      label: `At least ${requirement.min} ${name} badges`,
      detail: `${count} of ${requirement.min} ${name} badges.`,
    };
  }

  const domains = layerDomains(input.domains, requirement.layer);
  const counts = countByDomain(input.earned);
  const short = domains.filter((domain) => (counts.get(domain.id) ?? 0) < requirement.minEach);
  const covered = domains.length - short.length;
  const name = requirement.layer === 'civic' ? 'civic' : 'personal';
  const noun = requirement.minEach === 1 ? 'badge' : 'badges';
  return {
    met: short.length === 0 && domains.length > 0,
    label: `At least ${requirement.minEach} ${noun} in each ${name} domain`,
    detail:
      short.length === 0
        ? `All ${domains.length} ${name} domains are covered.`
        : `${covered} of ${domains.length}. Still short: ${short.map((domain) => domain.name).join(', ')}.`,
  };
}

export function evaluateRank(input: {
  assessmentCompleted: boolean;
  earned: EarnedBadge[];
  ranks: RankDefinition[];
  domains: Domain[];
}): RankSnapshot {
  const ordered = [...input.ranks].sort((a, b) => a.order - b.order);
  let current: RankDefinition | null = null;
  let next: RankDefinition | null = null;

  for (const rank of ordered) {
    const met = rank.requirements.every((requirement) => checkRequirement(requirement, input).met);
    if (met) {
      current = rank;
    } else {
      next = rank;
      break;
    }
  }

  const focus = next ?? current;
  return {
    current,
    next,
    checks: focus ? focus.requirements.map((requirement) => checkRequirement(requirement, input)) : [],
    earnedCount: input.earned.length,
  };
}
