import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'admin_role_request' })
export class AdminRequestEntity {
  @PrimaryGeneratedColumn({ name: 'request_id' })
  requestId!: number;

  @Column({ name: 'user_id' })
  userId!: number;

  @Column({ name: 'room_id' })
  roomId!: number;

  @Column({ name: 'request_status', type: 'enum', enum: ['pending', 'accepted', 'denied', ''], default: 'pending' })
  status!: 'pending' | 'accepted' | 'denied';

  @Column({ name: 'created_date', type: 'date', nullable: true })
  createdDate!: Date;
}
