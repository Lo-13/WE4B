export class CreateRoomDto {
  name!: string;
  address!: string;
  capacity!: number | string;
  hourlyPrice!: number | string;
  description!: string;
  status?: 'available' | 'unavailable' | 'maintenance';
  latitude!: number | string;
  longitude!: number | string;
  uploadedBy?: number | string;
}
