import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { LoginComponent } from './features/login/login.component';
import { MyReservationsComponent } from './features/my-reservations/my-reservations.component';
import { ProfileComponent } from './features/profile/profile.component';
import { ReservationFormComponent } from './features/reservation-form/reservation-form.component';
import { ReservationsComponent } from './features/reservations/reservations.component';
import { RoomDetailComponent } from './features/rooms/room-detail/room-detail.component';
import { RoomCreateComponent } from './features/rooms/room-create/room-create.component';
import { RoomsListComponent } from './features/rooms/rooms-list/rooms-list.component';
import { AdminLogsComponent } from './features/admin-logs/admin-logs.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'rooms',
    component: RoomsListComponent,
  },
  {
    path: 'admin/rooms/new',
    component: RoomCreateComponent,
    canActivate: [roleGuard],
    data: { roles: ['admin', 'super-admin'] },
  },
  {
    path: 'rooms/:id',
    component: RoomDetailComponent,
  },
  {
    path: 'rooms/:id/reserve',
    component: ReservationFormComponent,
    canActivate: [authGuard],
  },
  {
    path: 'my-reservations',
    component: MyReservationsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'reservations',
    component: ReservationsComponent,
    canActivate: [roleGuard],
    data: { roles: ['admin', 'super-admin'] },
  },
    {
        path: 'admin-logs',
        component: AdminLogsComponent,
        canActivate: [roleGuard],
        data: { roles: ['admin', 'super-admin'] },
    },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: 'dashboard' },
];
