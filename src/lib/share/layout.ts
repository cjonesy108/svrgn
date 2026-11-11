export const CARD_WIDTH = 1080;
export const CARD_HEIGHT = 1350;
export const CARD_PAD = 84;
export const CARD_TEXT_WIDTH = CARD_WIDTH - CARD_PAD * 2;

function charFactor(bold: boolean): number {
  return bold ? 0.62 : 0.54;
}

export function estimateWidth(text: string, fontSize: number, letterSpacing = 0, bold = false): number {
  return text.length * (fontSize * charFactor(bold) + letterSpacing);
}

function ellipsize(line: string, fontSize: number, maxWidth: number, letterSpacing: number, bold: boolean): string {
  const mark = '…';
  let value = line.trimEnd();
  while (value.length > 0 && estimateWidth(`${value}${mark}`, fontSize, letterSpacing, bold) > maxWidth) {
    value = value.slice(0, -1).trimEnd();
  }
  return `${value || line.slice(0, 1)}${mark}`;
}

/** Break text so each line fits a share card. The last line gains an ellipsis if anything is cut. */
export function wrapText(
  text: string,
  fontSize: number,
  maxWidth: number,
  maxLines = 4,
  letterSpacing = 0,
  bold = false,
): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0 || maxLines < 1) return [];
  const lines: string[] = [];
  let index = 0;
  while (index < words.length && lines.length < maxLines) {
    let line = words[index] ?? '';
    index += 1;
    while (index < words.length) {
      const next = `${line} ${words[index]}`;
      if (estimateWidth(next, fontSize, letterSpacing, bold) > maxWidth) break;
      line = next;
      index += 1;
    }
    lines.push(line);
  }
  if (index < words.length && lines.length > 0) {
    const last = lines.length - 1;
    lines[last] = ellipsize(lines[last] ?? '', fontSize, maxWidth, letterSpacing, bold);
  }
  return lines;
}

export function cardFileName(kind: 'badge' | 'rank', label: string): string {
  const slug = label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
  return `sovereign-path-${kind}-${slug || 'card'}.png`;
}

export function formatCardDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export function badgeCountLabel(count: number): string {
  return count === 1 ? '1 badge earned' : `${count} badges earned`;
}
