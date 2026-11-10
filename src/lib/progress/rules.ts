export const MIN_REFLECTION_LENGTH = 40;

export function validateCompletion(input: {
  badge: { prerequisites: string[] } | undefined;
  earnedIds: ReadonlySet<string>;
  alreadyCompleted: boolean;
  attested: boolean;
  reflection: string;
}): { ok: true } | { ok: false; reason: string } {
  if (!input.badge) return { ok: false, reason: 'That badge is not in the catalog.' };
  if (input.alreadyCompleted) return { ok: false, reason: 'This badge is already complete.' };
  const unmet = input.badge.prerequisites.some((id) => !input.earnedIds.has(id));
  if (unmet) return { ok: false, reason: 'Finish the prerequisite badges first.' };
  if (!input.attested) return { ok: false, reason: 'Attest that you met every criterion.' };
  if (input.reflection.trim().length < MIN_REFLECTION_LENGTH) {
    return {
      ok: false,
      reason: `Write a reflection of at least ${MIN_REFLECTION_LENGTH} characters.`,
    };
  }
  return { ok: true };
}
