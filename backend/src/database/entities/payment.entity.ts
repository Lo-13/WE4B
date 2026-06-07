import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ReservationEntity } from './reservation.entity';

export type DatabasePaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type DatabasePaymentType = 'credit_card' | 'check' | 'cash' | 'other';

const decimalTransformer = {
  from: (value: string | number) => Number(value),
  to: (value: number) => value,
};

@Entity({ name: 'payment' })
export class PaymentEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'reservation_id', type: 'int' })
  reservationId!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, transformer: decimalTransformer })
  amount!: number;

  @Column({ type: 'enum', enum: ['credit_card', 'check', 'cash', 'other'] })
  type!: DatabasePaymentType;

  @Column({ type: 'datetime' })
  date!: Date;

  @Column({ type: 'enum', enum: ['pending', 'completed', 'failed', 'refunded'] })
  status!: DatabasePaymentStatus;

  @ManyToOne(() => ReservationEntity, (reservation) => reservation.payments)
  @JoinColumn({ name: 'reservation_id' })
  reservation!: ReservationEntity;
}
