import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly user = this.authService.currentUser;
  readonly isAuthenticated = this.authService.isAuthenticated;
  readonly canManageReservations = computed(() => {
    const user = this.user();

    return user?.role === 'admin' || user?.role === 'super-admin';
  });

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
