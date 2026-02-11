import { Component, EventEmitter, Input, Output } from '@angular/core';

type ViewId = 'dashboard' | 'linea' | 'categoria' | 'productos' | 'empleados'| 'clientes';

@Component({
  selector: 'app-aside',
  standalone: true,
  templateUrl: './aside.html',
  styleUrls: ['./aside.css'],
})
export class AsideComponent {
  @Input() activeView: 'graficos' | 'linea' | 'categoria' | 'productos'| 'empleados' | 'clientes' = 'graficos';
  @Output() viewChange = new EventEmitter<'graficos' | 'linea' | 'categoria'| 'productos'| 'empleados' | 'clientes'>();

  go(view: 'graficos' | 'linea'| 'categoria' | 'productos' | 'empleados' | 'clientes') {
    this.viewChange.emit(view);
  }
}
