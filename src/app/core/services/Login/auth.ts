import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Login } from '../../../../Model/Login';

@Injectable({ providedIn: 'root' })
export class Auth {
  private apiUrl = 'https://bakendcarpinteriac.onrender.com/api/auth/login';

  constructor(private http: HttpClient) {}

  // ================= LOGIN =================
  login(username: string, password: string): Observable<Login> {
    return this.http
      .post<Login>(this.apiUrl, { username, password })
      .pipe(
        tap((user) => {
          // ✅ guardar usuario
          if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(user));

            // ✅ guardar auth BASIC (lo necesitas para endpoints protegidos)
            localStorage.setItem(
              'auth',
              btoa(`${username}:${password}`)
            );
          }
        })
      );
  }

  // ================= LOGOUT =================
  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('auth');
    }
  }

  // ================= OBTENER USUARIO =================
  getUser(): Login | null {
    if (typeof window === 'undefined') return null;

    const raw = localStorage.getItem('user');
    return raw ? (JSON.parse(raw) as Login) : null;
  }

  // ================= VALIDAR SESIÓN =================
  isLoggedIn(): boolean {
    return !!this.getUser() && !!localStorage.getItem('auth');
  }
}
