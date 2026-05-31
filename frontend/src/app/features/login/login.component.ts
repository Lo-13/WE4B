import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly email = signal('b@gamingrooms.fr');
  readonly error = signal('');

  login(): void {
    const isLoggedIn = this.authService.login(this.email());

    if (!isLoggedIn) {
      this.error.set('Compte inconnu pour la demo.');
      return;
    }

    this.router.navigateByUrl('/dashboard');
  }
}
