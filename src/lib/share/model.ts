import type { Badge } from '../data/badges';
import type { DomainLayer } from '../data/domains';
import type { RankSnapshot } from '../progression/evaluate';

export type ShareCardModel =
  | {
      kind: 'badge';
      holderName: string;
      title: string;
      description: string;
      domainName: string;
      layer: DomainLayer;
      difficulty: string;
      earnedAt: string;
    }
  | {
      kind: 'rank';
      holderName: string;
      rankName: string;
      theme: string;
      order: number;
      summary: string;
      earnedCount: number;
      asOf: string;
    };

export function badgeShareModel(input: {
  badge: Badge;
  holderName: string;
  domainName: string;
  layer: DomainLayer;
  earnedAt: string;
}): ShareCardModel {
  return {
    kind: 'badge',
    holderName: input.holderName,
    title: input.badge.title,
    description: input.badge.description,
    domainName: input.domainName,
    layer: input.layer,
    difficulty: input.badge.difficulty,
    earnedAt: input.earnedAt,
  };
}

export function rankShareModel(snapshot: RankSnapshot, holderName: string, asOf = new Date().toISOString()): ShareCardModel | null {
  if (!snapshot.current) return null;
  return {
    kind: 'rank',
    holderName,
    rankName: snapshot.current.name,
    theme: snapshot.current.theme,
    order: snapshot.current.order,
    summary: snapshot.current.summary,
    earnedCount: snapshot.earnedCount,
    asOf,
  };
}
