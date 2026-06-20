import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api.config';

export interface AdminRequestDetail {
  requestId: number;
  userId: number;
  roomId: number;
  status: 'pending' | 'accepted' | 'denied';
  createdDate: string;
}

export interface AdminDetail {
  userId: number;
  roomId: number;
}

export interface ClientDetail {
  id: number;
  name: string;
  email: string;
  age: number;
  memberSince: string;
}

@Injectable({ providedIn: 'root' })
export class SuperAdminService {
  private readonly http = inject(HttpClient);

  getPendingRequests(): Observable<AdminRequestDetail[]> {
    return this.http.get<AdminRequestDetail[]>(`${API_BASE_URL}/admin-request/pending`);
  }

  getAcceptedRequests(): Observable<AdminDetail[]> {
    return this.http.get<AdminDetail[]>(`${API_BASE_URL}/admin-request/accepted`);
  }

  acceptRequest(id: number): Observable<void> {
    return this.http.patch<void>(`${API_BASE_URL}/admin-request/${id}/accept`, {});
  }

  denyRequest(id: number): Observable<void> {
    return this.http.patch<void>(`${API_BASE_URL}/admin-request/${id}/deny`, {});
  }

  getUsers(): Observable<{ clients: ClientDetail[]; admins: { id: number; name: string; email: string }[] }> {
    return this.http.get<{ clients: ClientDetail[]; admins: { id: number; name: string; email: string }[] }>(`${API_BASE_URL}/auth/users`);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/auth/users/${id}`);
  }

  deleteRoom(id: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/rooms/${id}`);
  }

  removeAdminRole(id: number): Observable<void> {
    return this.http.patch<void>(`${API_BASE_URL}/auth/users/${id}/remove-admin`, {});
  }
}
