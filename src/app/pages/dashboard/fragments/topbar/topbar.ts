import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../../../core/services/Login/auth';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [],
  templateUrl: './topbar.html',
  styleUrl: './topbar.css',
})
export class TopbarComponent {
  @Input() title = '';
  @Input() subtitle = '';

  constructor(private auth: Auth, private router: Router) {}

  confirmLogout(event: Event): void {
    event.preventDefault();

    const ok = confirm('¿Estás seguro que deseas cerrar sesión?');
    if (!ok) return;

    // ✅ borra lo que guardaste en login
    this.auth.logout();

    // Si tú guardaste también "auth" en base64, bórralo también:
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('auth');
    }

    // ✅ redirige al index (ruta "/")
    this.router.navigate(['/']);
  }
}

