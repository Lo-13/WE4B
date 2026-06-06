import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CommentEntity } from './comment.entity';
import { GameEntity } from './game.entity';
import { PaymentEntity } from './payment.entity';
import { RoomEntity } from './room.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'reservation' })
export class ReservationEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'user_id', type: 'int' })
  userId!: number;

  @Column({ name: 'room_id', type: 'int' })
  roomId!: number;

  @Column({ name: 'game_id', type: 'tinyint' })
  gameId!: number;

  @Column({ name: 'date_reservation', type: 'datetime' })
  dateReservation!: Date;

  @Column({ name: 'date_begin', type: 'datetime' })
  dateBegin!: Date;

  @Column({ name: 'date_end', type: 'datetime' })
  dateEnd!: Date;

  @Column({ name: 'nb_player', type: 'int' })
  nbPlayer!: number;

  @Column({ type: 'int' })
  status!: number;

  @Column({ name: 'total_price', type: 'int' })
  totalPrice!: number;

  @ManyToOne(() => UserEntity, (user) => user.reservations)
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  @ManyToOne(() => RoomEntity, (room) => room.reservations)
  @JoinColumn({ name: 'room_id' })
  room!: RoomEntity;

  @ManyToOne(() => GameEntity)
  @JoinColumn({ name: 'game_id' })
  game!: GameEntity;

  @OneToMany(() => CommentEntity, (comment) => comment.reservation)
  comments!: CommentEntity[];

  @OneToMany(() => PaymentEntity, (payment) => payment.reservation)
  payments!: PaymentEntity[];
}
