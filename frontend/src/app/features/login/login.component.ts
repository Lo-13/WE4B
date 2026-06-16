import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

type AuthMode = 'login' | 'register';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly mode = signal<AuthMode>('login');
  readonly email = signal('');
  readonly password = signal('');
  readonly name = signal('');
  readonly lastName = signal('');
  readonly age = signal(18);
  readonly error = signal('');

  readonly title = computed(() => (this.mode() === 'login' ? 'Acceder a Gaming Rooms' : 'Creer un compte client'));
  readonly submitLabel = computed(() => (this.mode() === 'login' ? 'Se connecter' : 'Creer le compte'));

  submit(): void {
    if (this.mode() === 'login') {
      this.login();
      return;
    }

    this.register();
  }

  switchMode(mode: AuthMode): void {
    this.mode.set(mode);
    this.error.set('');
  }

  private login(): void {
    this.authService.login(this.email(), this.password()).subscribe({
      next: () => {
        this.error.set('');
        this.router.navigateByUrl('/dashboard');
      },
      error: () => {
        this.error.set('Compte inconnu.');
      },
    });
  }

  private register(): void {
    this.authService
      .register({
        name: this.name(),
        lastName: this.lastName(),
        email: this.email(),
        password: this.password(),
        age: this.age(),
      })
      .subscribe({
        next: () => {
          this.error.set('');
          this.router.navigateByUrl('/dashboard');
        },
        error: () => {
          this.error.set('Impossible de creer ce compte. Verifie les champs ou utilise un autre email.');
        },
      });
  }
}
