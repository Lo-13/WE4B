import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CommentEntity } from './comment.entity';
import { ReservationEntity } from './reservation.entity';

export type DatabaseUserRole = 'user' | 'admin' | 'super_admin';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  email!: string;

  @Column({ length: 100 })
  name!: string;

  @Column({ name: 'last_name', length: 100 })
  lastName!: string;

  @Column({ type: 'tinyint' })
  age!: number;

  @Column({ length: 255 })
  password!: string;

  @Column({ type: 'enum', enum: ['user', 'admin', 'super_admin'] })
  role!: DatabaseUserRole;

  @Column({ name: 'registration_date', type: 'datetime' })
  registrationDate!: Date;

  @OneToMany(() => ReservationEntity, (reservation) => reservation.user)
  reservations!: ReservationEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.user)
  comments!: CommentEntity[];
}
