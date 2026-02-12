import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  standalone: true,
  template: '<p>Redirecting to your dashboard...</p>'
})
export class DashboardComponent {
  constructor(auth: AuthService, router: Router) {
    const target = auth.role() === 'MANAGER' ? '/manager' : '/clerk';
    void router.navigate([target]);
  }
}
