import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map, switchMap } from 'rxjs';

import { AuthService } from '../../core/services/auth.service';
import { ReservationsService } from '../../core/services/reservations.service';
import { RoomsService } from '../../core/services/rooms.service';

@Component({
  selector: 'app-reservation-form',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe, FormsModule, RouterLink],
  templateUrl: './reservation-form.component.html',
})
export class ReservationFormComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly roomsService = inject(RoomsService);
  private readonly reservationsService = inject(ReservationsService);

  readonly startDate = signal('2026-06-12');
  readonly startTime = signal('18:00');
  readonly duration = signal(2);
  readonly playerCount = signal(4);
  readonly message = signal('');
  readonly error = signal('');

  readonly user = this.authService.currentUser;
  readonly room$ = this.route.paramMap.pipe(
    map((params) => Number(params.get('id'))),
    switchMap((id) => this.roomsService.getRoomById(id)),
  );

  readonly totalPreview = computed(() => this.duration());

  submit(roomId: number, roomName: string, hourlyPrice: number, capacity: number): void {
    const user = this.user();

    if (!user) {
      this.router.navigateByUrl('/login');
      return;
    }

    if (this.playerCount() < 1 || this.playerCount() > capacity) {
      this.error.set(`Le nombre de joueurs doit etre compris entre 1 et ${capacity}.`);
      return;
    }

    this.reservationsService
      .createReservation({
        userId: user.id,
        roomId,
        roomName,
        customerName: user.name,
        startDate: this.startDate(),
        startTime: this.startTime(),
        duration: this.duration(),
        playerCount: this.playerCount(),
        hourlyPrice,
      })
      .subscribe(() => {
        this.message.set('Reservation envoyee. Elle apparait maintenant dans Mes reservations.');
        this.error.set('');
        this.router.navigateByUrl('/my-reservations');
      });
  }
}
