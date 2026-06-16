import { Component, inject } from "@angular/core";
import { AuthService } from "../../core/services/auth.service";

@Component({
  selector: "app-profile",
  standalone: true,
  templateUrl: "./profile.component.html",
})
export class ProfileComponent {
  private readonly authService = inject(AuthService);

  readonly user = this.authService.currentUser;
}
