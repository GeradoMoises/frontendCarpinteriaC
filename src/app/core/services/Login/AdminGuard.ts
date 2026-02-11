import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth } from './auth';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {

  constructor(private auth: Auth, private router: Router) {}

  canActivate(): boolean {
    const user = this.auth.getUser();

    // ⛔️ si no hay usuario, NO forzar index
    if (!user) {
      return false;
    }

    // ✅ solo ADMIN entra
    if (user.rol === 'ADMINISTRADOR') {
      return true;
    }

    // ⛔️ usuario sin permisos
    this.router.navigate(['/']);
    return false;
  }
}
