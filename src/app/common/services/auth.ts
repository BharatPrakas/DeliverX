import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { HttpRoutingService } from './http-routing';
import { User } from '../../core/models/core.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /**
  * Signal to manage the state of a common loader.
  * Can be used to dynamically toggle loading indicators in the UI.
  */
  commonLoader = signal(false);

  /**
   * Reactive authentication state (signal-based)
   * This allows UI components to react to auth changes.
   */
  isAuthenticated = signal<boolean>(!!this.getToken());

  constructor(
    private httpRoutingService: HttpRoutingService,
    private router: Router
  ) { }

  currentUser = signal<User | null>(null);

  /**
   * Retrieves the stored authentication token.
   * @returns The stored access token, or null if not found.
   */
  getToken(): string | null {
    return localStorage.getItem('access_token'); // Prefer secure storage in production
  }

  /**
   * Stores the authentication token securely.
   * @param token - JWT or access token to store.
   */
  setToken(token: string): void {
    localStorage.setItem('access_token', token);
    this.isAuthenticated.set(true); // Update signal state
    this.currentUser.set(JSON.parse(localStorage.getItem('user')!));
  }

  /**
   * Clears authentication token and logs out the user.
   */
  clearToken(): void {
    localStorage.removeItem('access_token');
    this.isAuthenticated.set(false); // Update signal state
    this.currentUser.set(null);
    this.router.navigate(['login']);
  }

  /**
   * Checks if the user is authenticated.
   * @returns `true` if a token exists, otherwise `false`.
   */
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  /**
   * Sends login request to API.
   * @param data - Login credentials (e.g., email & password).
   * @returns Observable with login response.
   */
  login(data: any): Observable<any> {
    return this.httpRoutingService.post('v1/login', data);
  }
}
