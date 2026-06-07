import { AsyncPipe, DatePipe, NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';

import { ReservationsService } from '../../core/services/reservations.service';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [AsyncPipe, DatePipe, NgClass],
  templateUrl: './reservations.component.html',
})
export class ReservationsComponent {
  private readonly reservationsService = inject(ReservationsService);

  readonly reservations$ = this.reservationsService.getReservations();
}
