// ─── Autenticação e Perfis ───

export type UserRole =
  | 'leitor_gratuito'
  | 'assinante_digital'
  | 'assinante_premium'
  | 'jornalista'
  | 'revisor'
  | 'editor'
  | 'editor_chefe'
  | 'administrador';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  bio?: string;
  phone?: string;
  subscription: SubscriptionState;
  bookmarks: string[];
  notificationPrefs: NotificationPreferences;
  createdAt: string;
}

export interface SubscriptionState {
  plan: 'gratuito' | 'digital' | 'premium';
  status: 'ativo' | 'inativo' | 'cancelamento_pendente';
  validUntil?: string;
  autoRenew: boolean;
}

export interface NotificationPreferences {
  breakingNews: boolean;
  dailyBrief: boolean;
  factChecks: boolean;
  weeklyDigest: boolean;
}

// ─── RBAC ───

export const STAFF_ROLES: readonly UserRole[] = [
  'jornalista', 'revisor', 'editor', 'editor_chefe', 'administrador',
] as const;

export const EDITOR_ROLES: readonly UserRole[] = [
  'editor', 'editor_chefe', 'administrador',
] as const;

export const ADMIN_ROLES: readonly UserRole[] = [
  'editor_chefe', 'administrador',
] as const;

export function isStaff(role: UserRole): boolean {
  return STAFF_ROLES.includes(role);
}

export function isEditor(role: UserRole): boolean {
  return EDITOR_ROLES.includes(role);
}

export function isAdmin(role: UserRole): boolean {
  return ADMIN_ROLES.includes(role);
}
