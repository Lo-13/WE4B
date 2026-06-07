export type RoomStatus = 'available' | 'maintenance' | 'reserved';

export interface GamingRoom {
  id: number;
  name: string;
  city: string;
  address: string;
  capacity: number;
  hourlyPrice: number;
  equipment: string[];
  games: string[];
  status: RoomStatus;
  imageUrl: string;
  description: string;
  latitude: number;
  longitude: number;
}
