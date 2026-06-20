import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuperAdminService, AdminRequestDetail, AdminDetail, ClientDetail } from '../../core/services/super-admin.service';
import { RoomsService, GamingRoom } from '../../core/services/rooms.service';

@Component({
  selector: 'app-super-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './super-admin.html',
})
export class SuperAdmin implements OnInit {
  private readonly superAdminService = inject(SuperAdminService);
  private readonly roomsService = inject(RoomsService);

  pendingRequests = signal<AdminRequestDetail[]>([]);
  acceptedRequests = signal<AdminDetail[]>([]);
  clients = signal<ClientDetail[]>([]);
  rooms = signal<GamingRoom[]>([]);

  availableRooms = computed(() => this.rooms().filter((r) => r.status === 'available'));
  adminCount = computed(() => new Set(this.acceptedRequests().map((r) => r.userId)).size);

  ngOnInit(): void {
    this.loadAll();
  }

  private loadAll(): void {
    this.superAdminService.getPendingRequests().subscribe((r) => this.pendingRequests.set(r));
    this.superAdminService.getAcceptedRequests().subscribe((r) => this.acceptedRequests.set(r));
    this.superAdminService.getUsers().subscribe(({ clients }) => this.clients.set(clients));
    this.roomsService.getRooms().subscribe((r) => this.rooms.set(r));
  }

  accept(requestId: number): void {
    this.superAdminService.acceptRequest(requestId).subscribe(() => {
      this.superAdminService.getPendingRequests().subscribe((r) => this.pendingRequests.set(r));
      this.superAdminService.getAcceptedRequests().subscribe((r) => this.acceptedRequests.set(r));
    });
  }

  deny(requestId: number): void {
    this.superAdminService.denyRequest(requestId).subscribe(() => {
      this.pendingRequests.update((reqs) => reqs.filter((r) => r.requestId !== requestId));
    });
  }

  removeAdmin(userId: number): void {
    this.superAdminService.removeAdminRole(userId).subscribe(() => {
      this.acceptedRequests.update((reqs) => reqs.filter((r) => r.userId !== userId));
    });
  }

  deleteUser(id: number): void {
    this.superAdminService.deleteUser(id).subscribe(() => {
      this.clients.update((list) => list.filter((u) => u.id !== id));
    });
  }

  deleteRoom(id: number): void {
    this.superAdminService.deleteRoom(id).subscribe(() => {
      this.rooms.update((list) => list.filter((r) => r.id !== id));
    });
  }
}
