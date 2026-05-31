import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, switchMap } from 'rxjs';

import { RoomsService } from '../../../core/services/rooms.service';

@Component({
  selector: 'app-room-detail',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe, RouterLink],
  templateUrl: './room-detail.component.html',
})
export class RoomDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly roomsService = inject(RoomsService);

  readonly room$ = this.route.paramMap.pipe(
    map((params) => Number(params.get('id'))),
    switchMap((id) => this.roomsService.getRoomById(id)),
  );
}
