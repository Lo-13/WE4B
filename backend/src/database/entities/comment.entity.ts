import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ReservationEntity } from './reservation.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'comment' })
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'user_id', type: 'int' })
  userId!: number;

  @Column({ name: 'reservation_id', type: 'int' })
  reservationId!: number;

  @Column({ type: 'text' })
  content!: string;

  @Column({ type: 'tinyint' })
  rate!: number;

  @Column({ type: 'datetime' })
  date!: Date;

  @Column({ name: 'is_valid', type: 'tinyint' })
  isValid!: number;

  @ManyToOne(() => UserEntity, (user) => user.comments)
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  @ManyToOne(() => ReservationEntity, (reservation) => reservation.comments)
  @JoinColumn({ name: 'reservation_id' })
  reservation!: ReservationEntity;
}
