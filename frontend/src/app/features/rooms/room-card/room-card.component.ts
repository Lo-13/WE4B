import { CurrencyPipe, NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { GamingRoom } from '../../../core/services/rooms.service';

@Component({
  selector: 'app-room-card',
  standalone: true,
  imports: [CurrencyPipe, NgClass],
  templateUrl: './room-card.component.html',
})
export class RoomCardComponent {
  @Input({ required: true }) room!: GamingRoom;
  @Output() selected = new EventEmitter<number>();

  selectRoom(): void {
    this.selected.emit(this.room.id);
  }
}
