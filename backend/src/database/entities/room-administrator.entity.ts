import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'room_administrator' })
export class RoomAdministratorEntity {
  @PrimaryColumn({ name: 'room_id' })
  roomId!: number;

  @PrimaryColumn({ name: 'user_id' })
  userId!: number;
}
