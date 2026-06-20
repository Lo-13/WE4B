import { AsyncPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AdminRequestService } from "../../core/services/adminrequest.service";
import { AuthService } from "../../core/services/auth.service";
import { GamingRoom, RoomsService } from "../../core/services/rooms.service";
import { Observable } from "rxjs";

@Component({
  selector: "app-profile",
  standalone: true,
  imports: [FormsModule, AsyncPipe],
  templateUrl: "./profile.component.html",
})
export class ProfileComponent {
  private readonly authService = inject(AuthService);
  private readonly roomsService = inject(RoomsService);
  private readonly adminRequestService = inject(AdminRequestService);

  readonly user = this.authService.currentUser;
  readonly rooms: Observable<GamingRoom[]> = this.roomsService.getRooms();
  selectedRoomId: number | null = null;

  requestAdmin(): void {
    const userId = this.user()?.id;
    if (!userId || !this.selectedRoomId) return;
    this.adminRequestService.requestAdmin({ userId, roomId: this.selectedRoomId }).subscribe();
  }
}
