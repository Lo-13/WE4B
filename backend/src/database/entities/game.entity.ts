import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RoomEntity } from './room.entity';

@Entity({ name: 'game' })
export class GameEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  title!: string;

  @Column({ type: 'int' })
  genre!: number;

  @Column({ name: 'nb_player_max', type: 'int' })
  nbPlayerMax!: number;

  @Column({ length: 50 })
  plateform!: string;

  @Column({ type: 'text' })
  description!: string;

  @ManyToMany(() => RoomEntity, (room) => room.games)
  rooms!: RoomEntity[];
}
