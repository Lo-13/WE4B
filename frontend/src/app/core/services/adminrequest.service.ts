import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api.config';

@Injectable({ providedIn: 'root' })
export class AdminRequestService {
  private readonly http = inject(HttpClient);

  requestAdmin(body: { userId: number; roomId: number }): Observable<void> {
    return this.http.post<void>(`${API_BASE_URL}/admin-request`, body);
  }
}
