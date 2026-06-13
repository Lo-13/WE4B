import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_BASE_URL } from '../api.config';
 
@Injectable({ providedIn: 'root' })

export class AdminRequestService {
  private readonly http = inject(HttpClient);

  requestAdmin(payload: { userId: number; roomId: number }) {
    return this.http.post(`${API_BASE_URL}/admin-request`, payload);
  }
}