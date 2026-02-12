import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ManagerComponent } from './pages/manager/manager.component';
import { ClerkComponent } from './pages/clerk/clerk.component';

export const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'manager', component: ManagerComponent, canActivate: [authGuard], data: { roles: ['MANAGER'] } },
  { path: 'clerk', component: ClerkComponent, canActivate: [authGuard], data: { roles: ['CLERK'] } },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
