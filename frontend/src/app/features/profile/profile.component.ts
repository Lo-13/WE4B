import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RoomsService } from '../../core/services/rooms.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  imports: [AsyncPipe],
})
export class ProfileComponent {
  private readonly authService = inject(AuthService);
  private readonly roomsService = inject(RoomsService);

  readonly user = this.authService.currentUser;
readonly rooms = this.roomsService.getRooms();
}
