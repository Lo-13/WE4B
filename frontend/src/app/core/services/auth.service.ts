import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';

import { API_BASE_URL } from '../api.config';

export type UserRole = 'client' | 'admin' | 'super-admin';

export interface CurrentUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

interface LoginResponse {
  user: CurrentUser;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly storageKey = 'gamingRoomsCurrentUser';
  private readonly currentUserSignal = signal<CurrentUser | null>(this.readStoredUser());

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUserSignal() !== null);

  login(email: string): Observable<boolean> {
    return this.http.post<LoginResponse>(`${API_BASE_URL}/auth/login`, { email }).pipe(
      tap((response) => {
        this.currentUserSignal.set(response.user);
        localStorage.setItem(this.storageKey, JSON.stringify(response.user));
      }),
      map(() => true),
    );
  }

  logout(): void {
    this.currentUserSignal.set(null);
    localStorage.removeItem(this.storageKey);
  }

  hasRole(acceptedRoles: UserRole[]): boolean {
    const user = this.currentUserSignal();

    return user ? acceptedRoles.includes(user.role) : false;
  }

  private readStoredUser(): CurrentUser | null {
    const rawUser = localStorage.getItem(this.storageKey);

    if (!rawUser) {
      return null;
    }

    try {
      return JSON.parse(rawUser) as CurrentUser;
    } catch {
      localStorage.removeItem(this.storageKey);
      return null;
    }
  }
}
