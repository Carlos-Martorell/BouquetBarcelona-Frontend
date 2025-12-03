import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LoginResponse, RegisterData, User } from '@core/models/user';
import { switchMap, tap } from 'rxjs/operators';
import { environment } from '@env/environments';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly apiUrl = `${environment.apiUrl}/api/auth`;

  currentUserSignal = signal<User | null>(null);
  tokenSignal = signal<string | null>(null);
  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly token = this.tokenSignal.asReadonly();
  isLoggedIn = computed(() => !!this.token());
  isAdmin = computed(() => this.currentUser()?.role === 'admin');

  constructor() {
    this.loadFromStorage();
  }

  login(email: string, password: string) {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(tap(response => this.setAuth(response.access_token, response.user)));
  }

  register(data: RegisterData) {
    return this.http
      .post<User>(`${this.apiUrl}/register`, data)
      .pipe(switchMap(() => this.login(data.email, data.password)));
  }

  private setAuth(token: string, user: User) {
    this.tokenSignal.set(token);
    this.currentUserSignal.set(user);

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  private clearAuth() {
    this.tokenSignal.set(null);
    this.currentUserSignal.set(null);

    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  private loadFromStorage() {
    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user');

    if (token && userJson) {
      this.tokenSignal.set(token);
      this.currentUserSignal.set(JSON.parse(userJson));
    }
  }

  logout() {
    this.clearAuth();
    this.router.navigate(['/login']);
  }
}
