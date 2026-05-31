import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, map, of } from 'rxjs';

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

const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: 101,
    userId: 1,
    roomId: 1,
    roomName: 'Neon Arena',
    customerName: 'Camille Martin',
    startDate: '2026-06-04',
    startTime: '18:00',
    duration: 2,
    playerCount: 6,
    totalPrice: 76,
    status: 'confirmed',
    paymentStatus: 'paid',
  },
  {
    id: 102,
    userId: 1,
    roomId: 2,
    roomName: 'Pixel Lounge',
    customerName: 'Camille Martin',
    startDate: '2026-06-07',
    startTime: '20:00',
    duration: 3,
    playerCount: 4,
    totalPrice: 75,
    status: 'pending',
    paymentStatus: 'pending',
  },
  {
    id: 103,
    userId: 2,
    roomId: 3,
    roomName: 'Strategy Box',
    customerName: 'Noa Bernard',
    startDate: '2026-06-09',
    startTime: '14:00',
    duration: 4,
    playerCount: 8,
    totalPrice: 176,
    status: 'confirmed',
    paymentStatus: 'paid',
    comment: {
      rating: 9,
      content: 'Tres bonne salle pour une session equipe.',
      date: '2026-06-10',
    },
  },
];

@Injectable({ providedIn: 'root' })
export class ReservationsService {
  private readonly reservationsSubject = new BehaviorSubject<Reservation[]>(INITIAL_RESERVATIONS);

  getReservations(): Observable<Reservation[]> {
    return this.reservationsSubject.asObservable().pipe(delay(120));
  }

  getReservationsByUser(userId: number): Observable<Reservation[]> {
    return this.getReservations().pipe(
      map((reservations) => reservations.filter((reservation) => reservation.userId === userId)),
    );
  }

  createReservation(payload: CreateReservationPayload): Observable<Reservation> {
    const reservation: Reservation = {
      id: Date.now(),
      userId: payload.userId,
      roomId: payload.roomId,
      roomName: payload.roomName,
      customerName: payload.customerName,
      startDate: payload.startDate,
      startTime: payload.startTime,
      duration: payload.duration,
      playerCount: payload.playerCount,
      totalPrice: payload.duration * payload.hourlyPrice,
      status: 'pending',
      paymentStatus: 'pending',
    };

    this.reservationsSubject.next([reservation, ...this.reservationsSubject.value]);

    return of(reservation).pipe(delay(150));
  }

  addComment(reservationId: number, comment: ReservationComment): void {
    this.reservationsSubject.next(
      this.reservationsSubject.value.map((reservation) =>
        reservation.id === reservationId ? { ...reservation, comment } : reservation,
      ),
    );
  }
}
