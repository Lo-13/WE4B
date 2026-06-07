import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ReservationEntity } from './reservation.entity';
import { GameEntity } from './game.entity';
import { TypeMaterialEntity } from './type-material.entity';

export type DatabaseRoomStatus = 'available' | 'unavailable' | 'maintenance' | '';

const decimalTransformer = {
  from: (value: string | number) => Number(value),
  to: (value: number) => value,
};

@Entity({ name: 'room' })
export class RoomEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  name!: string;

  @Column({ length: 200 })
  address!: string;

  @Column({ type: 'int' })
  capacity!: number;

  @Column({
    name: 'hourly_rate',
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: decimalTransformer,
  })
  hourlyRate!: number;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'enum', enum: ['available', 'unavailable', 'maintenance', ''] })
  status!: DatabaseRoomStatus;

  @Column({ type: 'decimal', precision: 8, scale: 4, transformer: decimalTransformer })
  latitude!: number;

  @Column({ type: 'decimal', precision: 9, scale: 4, transformer: decimalTransformer })
  longitude!: number;

  @ManyToMany(() => GameEntity, (game) => game.rooms)
  @JoinTable({
    name: 'room_game',
    joinColumn: { name: 'room_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'game_id', referencedColumnName: 'id' },
  })
  games!: GameEntity[];

  @ManyToMany(() => TypeMaterialEntity, (material) => material.rooms)
  @JoinTable({
    name: 'room_type_material',
    joinColumn: { name: 'room_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'type_material_id', referencedColumnName: 'id' },
  })
  materials!: TypeMaterialEntity[];

  @OneToMany(() => ReservationEntity, (reservation) => reservation.room)
  reservations!: ReservationEntity[];
}
