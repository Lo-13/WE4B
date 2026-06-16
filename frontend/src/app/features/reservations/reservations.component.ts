import { AsyncPipe, DatePipe, NgClass } from "@angular/common";
import { Component, inject } from "@angular/core";
import { BehaviorSubject, switchMap } from "rxjs";

import { ReservationsService } from "../../core/services/reservations.service";

@Component({
  selector: "app-reservations",
  standalone: true,
  imports: [AsyncPipe, DatePipe, NgClass],
  templateUrl: "./reservations.component.html",
})
export class ReservationsComponent {
  private readonly reservationsService = inject(ReservationsService);
  private readonly refresh$ = new BehaviorSubject<void>(undefined);

  readonly reservations$ = this.refresh$.pipe(
    switchMap(() => this.reservationsService.getReservations()),
  );

  confirmReservation(id: number): void {
    this.reservationsService.updateReservationStatus(id, "confirmed").subscribe(() => {
      this.refresh$.next();
    });
  }

  cancelReservation(id: number): void {
    this.reservationsService.cancelReservation(id).subscribe(() => {
      this.refresh$.next();
    });
  }
}
