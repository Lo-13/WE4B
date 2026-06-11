import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';

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

export interface RegisterPayload {
  name: string;
  lastName: string;
  email: string;
  password?: string;
  age?: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly storageKey = 'gamingRoomsCurrentUser';
  private readonly currentUserSignal = signal<CurrentUser | null>(this.readStoredUser());

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUserSignal() !== null);

  login(email: string, password?: string): Observable<boolean> {
    return this.http.post<LoginResponse>(`${API_BASE_URL}/auth/login`, { email, password }).pipe(
      tap((response) => {
        this.storeCurrentUser(response.user);
      }),
      map(() => true),
    );
  }

  register(payload: RegisterPayload): Observable<boolean> {
    return this.http.post<LoginResponse>(`${API_BASE_URL}/auth/register`, payload).pipe(
      tap((response) => {
        this.storeCurrentUser(response.user);
      }),
      map(() => true),
    );
  }

  logout(): Observable<boolean> {
    const user = this.currentUserSignal();

    this.currentUserSignal.set(null);
    localStorage.removeItem(this.storageKey);

    if (!user) {
      return of(true);
    }

    return this.http.post<{ success: true }>(`${API_BASE_URL}/auth/logout`, { email: user.email }).pipe(
      map(() => true),
      catchError(() => of(true)),
    );
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
      const user = JSON.parse(rawUser) as CurrentUser;

      if (!Number.isInteger(Number(user.id)) || Number(user.id) < 1) {
        localStorage.removeItem(this.storageKey);
        return null;
      }

      return user;
    } catch {
      localStorage.removeItem(this.storageKey);
      return null;
    }
  }

  private storeCurrentUser(user: CurrentUser): void {
    this.currentUserSignal.set(user);
    localStorage.setItem(this.storageKey, JSON.stringify(user));
  }
}
