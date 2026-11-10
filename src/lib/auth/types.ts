import type { AuthMode } from './mode';

export interface AppUser {
  id: string;
  email: string;
  name: string;
  mode: Exclude<AuthMode, 'misconfigured'>;
}
