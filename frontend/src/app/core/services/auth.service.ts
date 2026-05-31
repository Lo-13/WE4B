import { Injectable, computed, signal } from '@angular/core';

export type UserRole = 'client' | 'admin' | 'super-admin';

export interface CurrentUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

const DEMO_USERS: CurrentUser[] = [
  {
    id: 58,
    name: 'Benjamin Dupuis',
    email: 'b@gamingrooms.fr',
    role: 'client',
  },
  {
    id: 57,
    name: 'Antoine Milo',
    email: 'a@gamingrooms.fr',
    role: 'admin',
  },
  {
    id: 56,
    name: 'Julie Bened',
    email: 'j@gamingrooms.fr',
    role: 'super-admin',
  },
];

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly currentUserSignal = signal<CurrentUser | null>(null);

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUserSignal() !== null);

  login(email: string): boolean {
    const user = DEMO_USERS.find((candidate) => candidate.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return false;
    }

    this.currentUserSignal.set(user);
    return true;
  }

  logout(): void {
    this.currentUserSignal.set(null);
  }

  hasRole(acceptedRoles: UserRole[]): boolean {
    const user = this.currentUserSignal();

    return user ? acceptedRoles.includes(user.role) : false;
  }
}
