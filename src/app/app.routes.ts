import { Routes } from '@angular/router';
import { IndexComponent } from './pages/index/index';
import { NosotrosComponent } from './pages/nosotros/nosotros';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { ServiciosComponent } from './pages/servicios/servicios';
import { ProductosComponent } from './pages/productos/productos';
import { ProcesoComponent } from './pages/proceso/proceso';
import { ContactoComponent } from './pages/contacto/contacto';
import { AdminGuard } from './core/services/Login/AdminGuard';
import { DetalleComponent } from './pages/detalle/detalle';
import {EmpleadosComponent} from './pages/dashboard/fragments/empleados/empleados';

export const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'nosotros', component: NosotrosComponent },

  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AdminGuard]
  },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'servicios', component: ServiciosComponent },
  { path: 'productos', component: ProductosComponent },
  {path: 'empleados', component: EmpleadosComponent},
  // ✅ SOLO ESTA RUTA PARA DETALLE
  { path: 'detalle/:id', component: DetalleComponent },

  { path: 'proceso', component: ProcesoComponent },
  { path: 'contacto', component: ContactoComponent },

  // opcional: redirección
  { path: '**', redirectTo: '' }
];
