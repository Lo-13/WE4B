import { Component, inject } from "@angular/core";
import { AsyncPipe } from "@angular/common";
import { RoomsService } from "../../core/services/rooms.service";
import { AuthService } from "../../core/services/auth.service";
import { AdminRequestService } from "../../core/services/adminrequest.service";
import { FormsModule } from "@angular/forms";
import { catchError } from "rxjs/operators";
import { of } from "rxjs";

@Component({
  selector: "app-profile",
  standalone: true,
  templateUrl: "./profile.component.html",
  imports: [AsyncPipe, FormsModule],
})
export class ProfileComponent {
  private readonly authService = inject(AuthService);
  private readonly roomsService = inject(RoomsService);
  private readonly adminRequestService = inject(AdminRequestService);

  readonly user = this.authService.currentUser;
  readonly rooms = this.roomsService.getRooms().pipe(catchError(() => of([])));
  selectedRoomId: number | null = null;

  requestAdmin() {
    const userId = this.user()?.id;
    const roomId = this.selectedRoomId;

    if (!userId || roomId === null) return;

    this.adminRequestService.requestAdmin({ userId, roomId }).subscribe({
      next: () => {
        alert("Demande envoyée avec succès !");
      },
      error: (err: any) => {
        console.error("Erreur lors de l'envoi de la demande :", err);
        alert("Une erreur est survenue lors de l'envoi de la demande.");
      },
    });
  }
}
