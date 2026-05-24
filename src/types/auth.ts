import type { AppRole as UserRole } from '../permissions/roles';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  displayName?: string;
  avatar?: string;
  portals?: string[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (user: User, token: string) => void;
  register: (user: User, token: string) => void;
  logout: () => void;
}

export interface AuthToken { access: string; refresh: string; }
