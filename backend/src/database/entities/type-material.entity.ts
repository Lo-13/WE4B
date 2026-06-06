import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RoomEntity } from './room.entity';

@Entity({ name: 'type_material' })
export class TypeMaterialEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 30 })
  name!: string;

  @ManyToMany(() => RoomEntity, (room) => room.materials)
  rooms!: RoomEntity[];
}
