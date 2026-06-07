import { AsyncPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, combineLatest, map } from 'rxjs';
import {LeafletMap} from '../leaflet-map/leaflet-map';
import { GamingRoom, RoomsService } from '../../../core/services/rooms.service';
import { RoomCardComponent } from '../room-card/room-card.component';

type SortMode = 'name' | 'price-asc' | 'price-desc' | 'capacity-desc';

@Component({
  selector: 'app-rooms-list',
  standalone: true,
  imports: [AsyncPipe, FormsModule, RoomCardComponent, LeafletMap],
  templateUrl: './rooms-list.component.html',
})
export class RoomsListComponent {
  private readonly roomsService = inject(RoomsService);
  private readonly router = inject(Router);

  readonly search = signal('');
  readonly city = signal('all');
  readonly sortMode = signal<SortMode>('name');

  private readonly rooms$ = this.roomsService.getRooms();

  readonly visibleRooms$: Observable<GamingRoom[]> = combineLatest([
    this.rooms$,
    toObservable(this.search),
    toObservable(this.city),
    toObservable(this.sortMode),
  ]).pipe(
    map(([rooms, search, city, sortMode]) => {
      const normalizedSearch = search.trim().toLowerCase();

      return rooms
        .filter((room) => city === 'all' || room.city === city)
        .filter((room) => {
          const searchableText = `${room.name} ${room.city} ${room.equipment.join(' ')}`.toLowerCase();
          return searchableText.includes(normalizedSearch);
        })
        .sort((first, second) => this.sortRooms(first, second, sortMode));
    }),
  );

  openRoom(id: number): void {
    this.router.navigate(['/rooms', id]);
  }

  updateSortMode(value: string): void {
    if (value === 'name' || value === 'price-asc' || value === 'price-desc' || value === 'capacity-desc') {
      this.sortMode.set(value);
    }
  }

  private sortRooms(first: GamingRoom, second: GamingRoom, sortMode: SortMode): number {
    if (sortMode === 'price-asc') {
      return first.hourlyPrice - second.hourlyPrice;
    }

    if (sortMode === 'price-desc') {
      return second.hourlyPrice - first.hourlyPrice;
    }

    if (sortMode === 'capacity-desc') {
      return second.capacity - first.capacity;
    }

    return first.name.localeCompare(second.name);
  }
}
