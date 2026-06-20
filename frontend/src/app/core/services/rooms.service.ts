import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../api.config';

export interface RoomReview {
  id: number;
  customerName: string;
  rating: number;
  content: string;
  date: string;
}

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
  reviews?: RoomReview[];
}

export interface CreateRoomPayload {
  name: string;
  address: string;
  capacity: number;
  hourlyPrice: number;
  description: string;
  status: 'available' | 'maintenance' | 'reserved';
  latitude: number;
  longitude: number;
  uploadedBy?: number;
  image?: File | null;
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

  createRoom(payload: CreateRoomPayload): Observable<GamingRoom> {
    const formData = new FormData();

    formData.append('name', payload.name);
    formData.append('address', payload.address);
    formData.append('capacity', String(payload.capacity));
    formData.append('hourlyPrice', String(payload.hourlyPrice));
    formData.append('description', payload.description);
    formData.append('status', payload.status === 'reserved' ? 'unavailable' : payload.status);
    formData.append('latitude', String(payload.latitude));
    formData.append('longitude', String(payload.longitude));

    if (payload.uploadedBy) {
      formData.append('uploadedBy', String(payload.uploadedBy));
    }

    if (payload.image) {
      formData.append('image', payload.image);
    }

    return this.http.post<GamingRoom>(`${API_BASE_URL}/rooms`, formData);
  }
}
