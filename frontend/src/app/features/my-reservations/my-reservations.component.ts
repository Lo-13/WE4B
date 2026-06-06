import { AsyncPipe, CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, switchMap, startWith } from 'rxjs';

import { AuthService } from '../../core/services/auth.service';
import { Reservation, ReservationsService } from '../../core/services/reservations.service';

@Component({
  selector: 'app-my-reservations',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe, DatePipe, FormsModule, NgClass],
  templateUrl: './my-reservations.component.html',
})
export class MyReservationsComponent {
  private readonly authService = inject(AuthService);
  private readonly reservationsService = inject(ReservationsService);

  readonly user = this.authService.currentUser;
  readonly rating = signal(8);
  readonly commentText = signal('');
  private readonly refreshReservations$ = new Subject<void>();
  readonly reservations$ = computed(() => {
    const user = this.user();
    return this.refreshReservations$.pipe(
      startWith(undefined),
      switchMap(() => this.reservationsService.getReservationsByUser(user?.id ?? 0)),
    );
  });

  isHistoric(reservation: Reservation): boolean {
    return reservation.status === 'cancelled' || reservation.status === 'confirmed';
  }

  addComment(reservationId: number): void {
    const content = this.commentText().trim();

    if (!content) {
      return;
    }

    this.reservationsService
      .addComment(reservationId, {
        rating: this.rating(),
        content,
        date: new Date().toISOString().slice(0, 10),
      })
      .subscribe(() => {
        this.commentText.set('');
        this.refreshReservations$.next();
      });
  }
}
