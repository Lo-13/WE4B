export type ReservationStatus = 'confirmed' | 'pending' | 'cancelled';
export type PaymentStatus = 'paid' | 'pending';

export interface ReservationComment {
  rating: number;
  content: string;
  date: string;
}

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
  status: ReservationStatus;
  paymentStatus: PaymentStatus;
  comment?: ReservationComment;
}
