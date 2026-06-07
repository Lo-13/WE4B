import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../api.config';

export interface GamingRoom {
  id: number;
  name: string;
  city: string;
  address: string;
  capacity: number;
  hourlyPrice: number;
  equipment: string[];
  games: string[];
  status: 'available' | 'maintenance' | 'reserved';
  imageUrl: string;
  description: string;
  latitude: number;
  longitude: number;
}

@Injectable({ providedIn: 'root' })
export class RoomsService {
  private readonly http = inject(HttpClient);

  getRooms(): Observable<GamingRoom[]> {
    return this.http.get<GamingRoom[]>(`${API_BASE_URL}/rooms`);
  }

  getRoomById(id: number): Observable<GamingRoom | undefined> {
    return this.http.get<GamingRoom>(`${API_BASE_URL}/rooms/${id}`);
  }
}
