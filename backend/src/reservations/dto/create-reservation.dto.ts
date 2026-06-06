export class CreateReservationDto {
  userId!: number;
  roomId!: number;
  gameId?: number;
  customerName!: string;
  startDate!: string;
  startTime!: string;
  duration!: number;
  playerCount!: number;
}
