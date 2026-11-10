export interface NarrativeInput {
  name: string;
  score: number;
}

export interface Narrative {
  strengthNames: string[];
  gapNames: string[];
  paragraphs: string[];
}

function joinNames(names: string[]): string {
  if (names.length <= 1) return names[0] ?? '';
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`;
}

export function buildNarrative(rows: NarrativeInput[]): Narrative {
  const byHigh = [...rows].sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
  const byLow = [...rows].sort((a, b) => a.score - b.score || a.name.localeCompare(b.name));
  const strengthNames = byHigh.filter((row) => row.score >= 70).slice(0, 2).map((row) => row.name);
  const strengthSet = new Set(strengthNames);
  const gapNames = byLow
    .filter((row) => !strengthSet.has(row.name))
    .slice(0, 3)
    .map((row) => row.name);

  const paragraphs = [
    strengthNames.length > 0
      ? `Strongest right now: ${joinNames(strengthNames)}.`
      : 'No domain is strong yet. That is a usable baseline, not a verdict.',
    gapNames.length > 0
      ? `The widest gaps are ${joinNames(gapNames)}. Badges there move the next rank fastest.`
      : 'The domains are close together. Pick a badge you can finish this month.',
    'These scores are calculated from the answers you stored. Retake the intake when the facts change.',
  ];

  return { strengthNames, gapNames, paragraphs };
}
