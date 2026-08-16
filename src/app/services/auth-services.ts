import { Injectable, computed, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private router: Router) {}

  // Signals

  private tokenSignal = signal<string | null>(localStorage.getItem('access_token'));

  private roleSignal = signal<string | null>(localStorage.getItem('role'));

  private idSignal = signal<number | null>(
    localStorage.getItem('id') ? Number(localStorage.getItem('id')) : null,
  );

  private fullNameSignal = signal<string | null>(localStorage.getItem('full_name'));

  private emailSignal = signal<string | null>(localStorage.getItem('email'));

  // Computed Signals

  readonly isLoggedIn = computed(() => !!this.tokenSignal());

  readonly role = computed(() => this.roleSignal());

  readonly normalizedRole = computed(() => this.roleSignal()?.toUpperCase() ?? null);

  readonly fullName = computed(() => this.fullNameSignal());

  readonly email = computed(() => this.emailSignal());

  readonly userId = computed(() => this.idSignal());

  // Save User Session

  setSession(data: {
    access_token: string;
    token_type: string;
    role: string;
    id: number;
    full_name: string;
    email: string;
  }): void {
    localStorage.setItem('access_token', data.access_token);

    localStorage.setItem('token_type', data.token_type);

    localStorage.setItem('role', data.role);

    localStorage.setItem('id', data.id.toString());

    localStorage.setItem('full_name', data.full_name);

    localStorage.setItem('email', data.email);

    this.tokenSignal.set(data.access_token);

    this.roleSignal.set(data.role);

    this.idSignal.set(data.id);

    this.fullNameSignal.set(data.full_name);

    this.emailSignal.set(data.email);
  }

  // Get Token

  getToken(): string | null {
    return this.tokenSignal();
  }

  // Get User Role

  getRole(): string | null {
    return this.roleSignal();
  }

  // Get User Id

  getUserId(): number | null {
    return this.idSignal();
  }

  // Get Full Name

  getFullName(): string | null {
    return this.fullNameSignal();
  }

  // Get Email

  getEmail(): string | null {
    return this.emailSignal();
  }

  // Is Logged In

  isUserLoggedIn(): boolean {
    return this.isLoggedIn();
  }

  // Is Admin

  isAdmin(): boolean {
    return this.normalizedRole() === 'ADMIN';
  }

  // Is Customer

  isCustomer(): boolean {
    const role = this.normalizedRole();

    return role === 'CUSTOMER' || role === 'USER';
  }

  // Current User

  getCurrentUser() {
    return {
      id: this.userId(),

      full_name: this.fullName(),

      email: this.email(),

      role: this.role(),
    };
  }

  // Clear Session

  clearSession(): void {
    localStorage.clear();

    this.tokenSignal.set(null);

    this.roleSignal.set(null);

    this.idSignal.set(null);

    this.fullNameSignal.set(null);

    this.emailSignal.set(null);
  }

  // Logout

  logout(): void {
    this.clearSession();

    this.router.navigate(['/login']);
  }
}
