import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { LoginRequest, LoginResponse, Role } from '../shared/models/types';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly user = signal<string | null>(localStorage.getItem('username'));
  readonly role = signal<Role | null>(localStorage.getItem('role') as Role | null);

  constructor(private http: HttpClient, private router: Router) {}

  login(payload: LoginRequest) {
    return this.http.post<LoginResponse>(`${environment.apiBaseUrl}/auth/login`, payload).pipe(
      tap((response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('username', response.username);
        localStorage.setItem('role', response.role);
        this.user.set(response.username);
        this.role.set(response.role);
      })
    );
  }

  logout(message?: string): void {
    localStorage.clear();
    this.user.set(null);
    this.role.set(null);

    if (message) {
      localStorage.setItem('logoutMessage', message);
    }

    void this.router.navigate(['/login']);
  }

  get token(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.token;
  }
}
