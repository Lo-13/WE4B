import { Component, computed, inject } from "@angular/core";
import { RouterLink } from "@angular/router";

import { AuthService } from "../../core/services/auth.service";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./dashboard.component.html",
})
export class DashboardComponent {
  private readonly authService = inject(AuthService);

  readonly user = this.authService.currentUser;
  readonly canManageReservations = computed(() => {
    const user = this.user();

    return user?.role === "admin" || user?.role === "super-admin";
  });
}
