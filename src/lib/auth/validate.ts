const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function validateSignUp(input: { name: string; email: string; password: string }): string | null {
  if (input.name.trim().length < 2) return 'Enter the name you want on the path.';
  if (!EMAIL.test(normalizeEmail(input.email))) return 'Enter a valid email address.';
  if (input.password.length < 8) return 'Use at least 8 characters.';
  return null;
}

export function validateSignIn(input: { email: string; password: string }): string | null {
  if (!EMAIL.test(normalizeEmail(input.email))) return 'Enter a valid email address.';
  if (input.password.length < 8) return 'Use at least 8 characters.';
  return null;
}
