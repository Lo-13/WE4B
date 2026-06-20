import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuperAdminService, AdminDetail, ClientDetail } from '../../core/services/super-admin.service';
import { RoomsService, GamingRoom } from '../../core/services/rooms.service';

@Component({
  selector: 'app-visualisation-superadmin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './visualisation-superadmin.html',
})
export class VisualisationSuperadmin implements OnInit {
  private readonly superAdminService = inject(SuperAdminService);
  private readonly roomsService = inject(RoomsService);

  acceptedRequests = signal<AdminDetail[]>([]);
  clients = signal<ClientDetail[]>([]);
  rooms = signal<GamingRoom[]>([]);

  availableRooms = computed(() => this.rooms().filter((r) => r.status === 'available'));
  adminCount = computed(() => new Set(this.acceptedRequests().map((r) => r.userId)).size);

  ngOnInit(): void {
    this.superAdminService.getAcceptedRequests().subscribe((r) => this.acceptedRequests.set(r));
    this.superAdminService.getUsers().subscribe(({ clients }) => this.clients.set(clients));
    this.roomsService.getRooms().subscribe((r) => this.rooms.set(r));
  }
}
