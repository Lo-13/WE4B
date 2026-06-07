export type UserRole = 'client' | 'admin' | 'super-admin';

export interface CurrentUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}
