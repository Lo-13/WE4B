import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { RoomsService } from '../../../core/services/rooms.service';

type RoomFormStatus = 'available' | 'maintenance' | 'reserved';

@Component({
  selector: 'app-room-create',
  standalone: true,
  imports: [CurrencyPipe, FormsModule, RouterLink],
  templateUrl: './room-create.component.html',
})
export class RoomCreateComponent {
  private readonly authService = inject(AuthService);
  private readonly roomsService = inject(RoomsService);
  private readonly router = inject(Router);

  readonly name = signal('');
  readonly address = signal('');
  readonly capacity = signal(6);
  readonly hourlyPrice = signal(25);
  readonly description = signal('');
  readonly status = signal<RoomFormStatus>('available');
  readonly latitude = signal(47.6379);
  readonly longitude = signal(6.8628);
  readonly image = signal<File | null>(null);
  readonly imagePreview = signal('');
  readonly isSubmitting = signal(false);
  readonly message = signal('');
  readonly error = signal('');

  readonly user = this.authService.currentUser;
  readonly estimatedLabel = computed(() => this.hourlyPrice() * 2);

  onImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    this.image.set(file);
    this.imagePreview.set('');

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview.set(String(reader.result ?? ''));
    };
    reader.readAsDataURL(file);
  }

  submit(): void {
    const user = this.user();
    const validationError = this.validate();

    if (validationError) {
      this.error.set(validationError);
      return;
    }

    this.isSubmitting.set(true);
    this.error.set('');
    this.message.set('');

    this.roomsService.createRoom({
      name: this.name().trim(),
      address: this.address().trim(),
      capacity: this.capacity(),
      hourlyPrice: this.hourlyPrice(),
      description: this.description().trim(),
      status: this.status(),
      latitude: this.latitude(),
      longitude: this.longitude(),
      uploadedBy: user?.id,
      image: this.image(),
    }).subscribe({
      next: (room) => {
        this.message.set('Salle créée.');
        this.isSubmitting.set(false);
        this.router.navigate(['/rooms', room.id]);
      },
      error: (error) => {
        this.isSubmitting.set(false);
        this.error.set(error?.error?.message ?? 'La salle n a pas pu etre creee.');
      },
    });
  }

  private validate(): string {
    if (!this.name().trim()) {
      return 'Le nom est obligatoire.';
    }

    if (!this.address().trim()) {
      return 'L adresse est obligatoire.';
    }

    if (this.capacity() < 1) {
      return 'La capacité doit être supérieure à 0.';
    }

    if (this.hourlyPrice() <= 0) {
      return 'Le tarif doit être supérieur à 0.';
    }

    if (!this.description().trim()) {
      return 'La description est obligatoire.';
    }

    if (!Number.isFinite(this.latitude()) || !Number.isFinite(this.longitude())) {
      return 'Les coordonnées GPS sont obligatoires.';
    }

    return '';
  }
}
