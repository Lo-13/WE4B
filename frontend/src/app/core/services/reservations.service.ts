import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../api.config';

export interface Reservation {
  id: number;
  userId: number;
  roomId: number;
  roomName: string;
  customerName: string;
  startDate: string;
  startTime: string;
  duration: number;
  playerCount: number;
  totalPrice: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  paymentStatus: 'paid' | 'pending';
  comment?: ReservationComment;
}

export interface ReservationComment {
  rating: number;
  content: string;
  date: string;
}

export interface CreateReservationPayload {
  userId: number;
  roomId: number;
  roomName: string;
  customerName: string;
  startDate: string;
  startTime: string;
  duration: number;
  playerCount: number;
  hourlyPrice: number;
}

@Injectable({ providedIn: 'root' })
export class ReservationsService {
  private readonly http = inject(HttpClient);

  getReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${API_BASE_URL}/reservations`);
  }

  getReservationsByUser(userId: number): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${API_BASE_URL}/reservations/user/${userId}`);
  }

  createReservation(payload: CreateReservationPayload): Observable<Reservation> {
    return this.http.post<Reservation>(`${API_BASE_URL}/reservations`, {
      userId: payload.userId,
      roomId: payload.roomId,
      customerName: payload.customerName,
      startDate: payload.startDate,
      startTime: payload.startTime,
      duration: payload.duration,
      playerCount: payload.playerCount,
    });
  }

  addComment(reservationId: number, comment: ReservationComment): Observable<Reservation> {
    return this.http.patch<Reservation>(`${API_BASE_URL}/reservations/${reservationId}/comment`, {
      rating: comment.rating,
      content: comment.content,
    });
  }
}
