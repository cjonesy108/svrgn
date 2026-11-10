export type DomainLayer = 'personal' | 'civic';

export interface Domain {
  id: string;
  name: string;
  short: string;
  layer: DomainLayer;
  order: number;
  description: string;
}

export const DOMAINS: Domain[] = [
  {
    id: 'physical',
    name: 'Physical',
    short: 'PHY',
    layer: 'personal',
    order: 1,
    description: 'Fitness, health, recovery, self-defense, and usable energy.',
  },
  {
    id: 'financial',
    name: 'Financial',
    short: 'FIN',
    layer: 'personal',
    order: 2,
    description: 'A written plan, a cash reserve, consumer debt, and a net-worth record.',
  },
  {
    id: 'practical',
    name: 'Practical Skills',
    short: 'SKL',
    layer: 'personal',
    order: 3,
    description: 'Repairs, cooking, tools, and a kit you can actually use.',
  },
  {
    id: 'mental',
    name: 'Mental & Emotional',
    short: 'MND',
    layer: 'personal',
    order: 4,
    description: 'Discipline, emotional regulation, focus, and a sleep window you keep.',
  },
  {
    id: 'relational',
    name: 'Relational',
    short: 'REL',
    layer: 'personal',
    order: 5,
    description: 'Household leadership, hard conversations, repair, and a circle that tells the truth.',
  },
  {
    id: 'purpose',
    name: 'Purpose & Values',
    short: 'PUR',
    layer: 'personal',
    order: 6,
    description: 'A mission, an ordered set of values, and a way to decide when goods collide.',
  },
  {
    id: 'systems',
    name: 'Systems Literacy',
    short: 'SYS',
    layer: 'civic',
    order: 7,
    description: 'How government, budgets, and institutions actually decide, and how a statute differs from a contract.',
  },
  {
    id: 'local',
    name: 'Local Engagement',
    short: 'LOC',
    layer: 'civic',
    order: 8,
    description: 'City councils, school boards, and the offices that can act on your block.',
  },
  {
    id: 'rights',
    name: 'Legal & Rights Literacy',
    short: 'RGT',
    layer: 'civic',
    order: 9,
    description: 'Constitutional structure, the limits of your own reading, and when to hire counsel.',
  },
  {
    id: 'community',
    name: 'Community Building',
    short: 'COM',
    layer: 'civic',
    order: 10,
    description: 'Concrete local help: people, tools, skill shares, and a way to ask.',
  },
  {
    id: 'voting',
    name: 'Voting & Reform',
    short: 'VOT',
    layer: 'civic',
    order: 11,
    description: 'Registration, the text of a measure, and reforms that are actually in process.',
  },
  {
    id: 'digital',
    name: 'Digital & Information Sovereignty',
    short: 'DIG',
    layer: 'civic',
    order: 12,
    description: 'Accounts, passwords, sources, and a written boundary for AI tools.',
  },
];

export function getDomain(id: string): Domain | undefined {
  return DOMAINS.find((domain) => domain.id === id);
}

export function domainsInLayer(layer: DomainLayer): Domain[] {
  return DOMAINS.filter((domain) => domain.layer === layer);
}
