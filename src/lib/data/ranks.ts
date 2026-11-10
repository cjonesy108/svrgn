import type { DomainLayer } from './domains';

export type RankRequirement =
  | { kind: 'assessment' }
  | { kind: 'badgeCount'; min: number }
  | { kind: 'perDomain'; layer: DomainLayer; minEach: number }
  | { kind: 'layerCount'; layer: DomainLayer; min: number };

export interface RankDefinition {
  id: string;
  name: string;
  order: number;
  theme: string;
  summary: string;
  requirements: RankRequirement[];
}

/**
 * Example thresholds from the product spec. Edit this list to retune ranks.
 * Higher ranks are checked only after every lower rank is already met.
 */
export const RANKS: RankDefinition[] = [
  {
    id: 'initiate',
    name: 'Initiate',
    order: 0,
    theme: 'Awareness',
    summary: 'Complete the intake. This rank is a baseline, not a compliment.',
    requirements: [{ kind: 'assessment' }],
  },
  {
    id: 'apprentice',
    name: 'Apprentice',
    order: 1,
    theme: 'Foundation',
    summary: '8 badges, with at least one in every personal domain.',
    requirements: [
      { kind: 'badgeCount', min: 8 },
      { kind: 'perDomain', layer: 'personal', minEach: 1 },
    ],
  },
  {
    id: 'journeyman',
    name: 'Journeyman',
    order: 2,
    theme: 'Competence',
    summary: '20 badges, with every personal domain represented and at least 3 civic badges.',
    requirements: [
      { kind: 'badgeCount', min: 20 },
      { kind: 'perDomain', layer: 'personal', minEach: 1 },
      { kind: 'layerCount', layer: 'civic', min: 3 },
    ],
  },
  {
    id: 'adept',
    name: 'Adept',
    order: 3,
    theme: 'Mastery',
    summary: '35 badges, with at least 2 in every personal domain and at least 1 in every civic domain.',
    requirements: [
      { kind: 'badgeCount', min: 35 },
      { kind: 'perDomain', layer: 'personal', minEach: 2 },
      { kind: 'perDomain', layer: 'civic', minEach: 1 },
    ],
  },
  {
    id: 'sovereign',
    name: 'Sovereign',
    order: 4,
    theme: 'Sovereignty',
    summary:
      '50 badges, with at least 3 in every personal domain and at least 2 in every civic domain. An outside review is not required in this version.',
    requirements: [
      { kind: 'badgeCount', min: 50 },
      { kind: 'perDomain', layer: 'personal', minEach: 3 },
      { kind: 'perDomain', layer: 'civic', minEach: 2 },
    ],
  },
];
