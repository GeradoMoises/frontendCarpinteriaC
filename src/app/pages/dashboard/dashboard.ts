import { Component, ViewChild } from '@angular/core';
import { AsideComponent } from './fragments/aside/aside';
import { TopbarComponent } from './fragments/topbar/topbar';
import { LineaComponent } from './fragments/linea/linea';
import { GraficosComponent } from './fragments/graficos/graficos';
import { CategoriaComponent } from './fragments/categoria/categoria';
import { ProductosComponent } from './fragments/productos/productos';
import { EmpleadosComponent } from './fragments/empleados/empleados';
import { ClientesComponent} from './fragments/clientes/clientes';

type ViewId = 'graficos' | 'linea' | 'categoria' | 'productos' | 'empleados' | 'clientes';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    AsideComponent,
    TopbarComponent,
    LineaComponent,
    GraficosComponent,
    CategoriaComponent,
    ProductosComponent,
    EmpleadosComponent,
    ClientesComponent,
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class DashboardComponent {
  currentView: ViewId = 'graficos';

  // ✅ referencia al componente de Linea (cuando esté renderizado)
  @ViewChild(LineaComponent) lineaComp?: LineaComponent;

  titles: Record<ViewId, { title: string; subtitle: string }> = {
    graficos: { title: 'Dashboard', subtitle: 'Resumen general de la carpintería' },
    linea: { title: 'Líneas de Diseño', subtitle: 'Administra las líneas de diseño' },
    categoria: { title: 'Categorías', subtitle: 'Administra las categorías de productos' },
    productos: { title: 'Productos', subtitle: 'Productos de productos' },
    empleados: { title: 'Empleados', subtitle: 'Registro de Empleados'},
    clientes: { title: 'Clientes', subtitle: 'Registro de cliente' },
  };

  switchView(view: ViewId) {
    this.currentView = view;

    // ✅ cuando entras a "linea", refresca después de que Angular lo monte
    if (view === 'linea') {
      setTimeout(() => {
        this.lineaComp?.refresh();
      }, 0);
    }
  }
}
