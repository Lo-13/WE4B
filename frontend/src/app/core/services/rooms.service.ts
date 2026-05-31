import { Injectable } from '@angular/core';
import { Observable, delay, map, of } from 'rxjs';

export interface GamingRoom {
  id: number;
  name: string;
  city: string;
  address: string;
  capacity: number;
  hourlyPrice: number;
  equipment: string[];
  games: string[];
  status: 'available' | 'maintenance' | 'reserved';
  imageUrl: string;
  description: string;
}

const ROOMS: GamingRoom[] = [
  {
    id: 1,
    name: 'Alpha PC',
    city: 'Paris',
    address: '12 Rue Oberkampf, 75011 Paris',
    capacity: 6,
    hourlyPrice: 15,
    equipment: ['PC Gaming', 'Ecran 144Hz'],
    games: ['Counter-Strike 2', 'Valorant', 'League of Legends'],
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=80',
    description: 'Salle PC compacte avec 6 postes, ecrans 144Hz et casques micro.',
  },
  {
    id: 2,
    name: 'Omega Console',
    city: 'Lyon',
    address: '25 Rue Merciere, 69002 Lyon',
    capacity: 8,
    hourlyPrice: 20,
    equipment: ['Console', 'Television 4K'],
    games: ['EA Sports FC 25', 'Super Smash Bros. Ultimate'],
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=1000&q=80',
    description: 'Salon console avec PS5, canape, television 4K et jeux multijoueurs.',
  },
  {
    id: 3,
    name: 'Nexus Bordeaux',
    city: 'Bordeaux',
    address: '47 Cours Victor Hugo, 33000 Bordeaux',
    capacity: 10,
    hourlyPrice: 14,
    equipment: ['PC Gaming', 'Console'],
    games: ['Rocket League', 'EA Sports FC 25'],
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1000&q=80',
    description: 'Salle polyvalente pour groupes, consoles et postes PC legers.',
  },
  {
    id: 4,
    name: 'VR Lab Lille',
    city: 'Lille',
    address: '6 Rue Nationale, 59000 Lille',
    capacity: 6,
    hourlyPrice: 18,
    equipment: ['Casque VR', 'Television 4K'],
    games: ['Beat Saber'],
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80',
    description: 'Espace VR avec casques recents et zone de jeu securisee.',
  },
  {
    id: 5,
    name: 'Retro Arcade Nantes',
    city: 'Nantes',
    address: '22 Quai de la Fosse, 44000 Nantes',
    capacity: 12,
    hourlyPrice: 16,
    equipment: ['Borne Arcade', 'Console'],
    games: ['Mario Kart 8 Deluxe', 'Super Smash Bros. Ultimate'],
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80',
    description: 'Salle retro avec bornes arcade et jeux Switch pour soirees entre amis.',
  },
  {
    id: 7,
    name: 'Console Loft Rennes',
    city: 'Rennes',
    address: '9 Rue Saint-Michel, 35000 Rennes',
    capacity: 6,
    hourlyPrice: 13,
    equipment: ['Console', 'Television 4K'],
    games: ['EA Sports FC 25', 'Mario Kart 8 Deluxe'],
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=1000&q=80',
    description: 'Petit loft console confortable pour sessions privees.',
  },
  {
    id: 8,
    name: 'ESport Toulouse',
    city: 'Toulouse',
    address: '14 Avenue de Muret, 31300 Toulouse',
    capacity: 16,
    hourlyPrice: 25,
    equipment: ['PC Gaming', 'Ecran 144Hz'],
    games: ['Counter-Strike 2', 'Valorant'],
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=80',
    description: "Salle e-sport pour entrainements d'equipe et mini-tournois.",
  },
  {
    id: 10,
    name: 'Studio Marseille',
    city: 'Marseille',
    address: '9 Boulevard de Louvain, 13008 Marseille',
    capacity: 4,
    hourlyPrice: 22,
    equipment: ['PC Gaming', 'Television 4K'],
    games: ['Street Fighter 6'],
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1000&q=80',
    description: 'Petite salle avec eclairage, micro et PC pour enregistrer ou jouer.',
  },
  {
    id: 11,
    name: "Maison de l'Esport",
    city: 'Paris',
    address: '11 Rue Soleillet, 75020 Paris',
    capacity: 40,
    hourlyPrice: 30,
    equipment: ['PC Gaming', 'Console', 'Ecran 144Hz'],
    games: ['Counter-Strike 2', 'Valorant', 'League of Legends'],
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=80',
    description: "Tiers-lieu parisien officiel dedie a l'esport, arena 600m2, regies techniques, consoles next-gen.",
  },
  {
    id: 12,
    name: 'GameRoom Lyon Sud',
    city: 'Lyon',
    address: '2 Rue du Professeur Appleton, 69007 Lyon',
    capacity: 14,
    hourlyPrice: 20,
    equipment: ['PC Gaming', 'Console'],
    games: ['Valorant', 'EA Sports FC 25'],
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=1000&q=80',
    description: 'Salle gaming a Lyon avec 8 PCs, 4 PS5, 2 Xbox Series X, ambiance neon cosy.',
  },
  {
    id: 13,
    name: 'NexusBox Bordeaux',
    city: 'Bordeaux',
    address: "47 Cours d'Alsace-et-Lorraine, 33000 Bordeaux",
    capacity: 10,
    hourlyPrice: 17,
    equipment: ['Console', 'Borne Arcade'],
    games: ['EA Sports FC 25', 'Super Smash Bros. Ultimate'],
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80',
    description: 'Petite salle premium a Bordeaux : PS5, Switch, decoration gaming retro-futuriste.',
  },
  {
    id: 14,
    name: 'PixelHub Marseille',
    city: 'Marseille',
    address: '9 Boulevard de Louvain, 13008 Marseille',
    capacity: 18,
    hourlyPrice: 19,
    equipment: ['PC Gaming', 'Console'],
    games: ['Counter-Strike 2', 'Street Fighter 6'],
    status: 'maintenance',
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1000&q=80',
    description: 'Salle gaming en bord de mer : PCs gaming, PS5, ambiance lounge, boissons incluses.',
  },
];

@Injectable({ providedIn: 'root' })
export class RoomsService {
  getRooms(): Observable<GamingRoom[]> {
    return of(ROOMS).pipe(delay(150));
  }

  getRoomById(id: number): Observable<GamingRoom | undefined> {
    return this.getRooms().pipe(map((rooms) => rooms.find((room) => room.id === id)));
  }
}
