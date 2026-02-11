import {
  Component,
  OnInit,
  Inject,
  PLATFORM_ID,
  ChangeDetectorRef
} from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { finalize } from 'rxjs/operators';

import { NavbarComponent } from '../../core/navbar/navbar';
import { FooterComponent } from '../../core/footer/footer';
import { ProductoService } from '../../core/services/Producto/Producto.service';
import { Producto } from '../../../Model/Producto';

declare const AOS: any;

@Component({
  selector: 'app-detalle',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, CommonModule, RouterModule],
  templateUrl: './detalle.html',
  styleUrl: './detalle.css',
})
export class DetalleComponent implements OnInit {

  producto?: Producto;

  imagenPrincipal = '';
  cargando = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private productoService: ProductoService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {

    // ✅ SSR FIX: solo cargar en navegador
    if (!isPlatformBrowser(this.platformId)) {
      this.cargando = false;
      return;
    }

    // ✅ escucha cambios /detalle/:id
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));

      if (!id) {
        this.error = 'ID inválido';
        this.cargando = false;
        this.cdr.detectChanges();
        return;
      }

      this.cargarProducto(id);
    });
  }

  cargarProducto(id: number): void {
    this.cargando = true;
    this.error = '';
    this.producto = undefined;
    this.cdr.detectChanges();

    this.productoService.buscarPublicoPorId(id)
      .pipe(
        finalize(() => {
          // ✅ pase lo que pase, apagamos loading
          this.cargando = false;
          this.cdr.detectChanges();

          // ✅ refresca AOS para que anime bien
          setTimeout(() => {
            if (typeof AOS !== 'undefined') {
              AOS.refreshHard?.();
              AOS.refresh?.();
            }
          }, 0);
        })
      )
      .subscribe({
        next: (data) => {
          this.producto = data;

          // ✅ imagen principal: imagen1 o primera disponible
          this.imagenPrincipal =
            data.imagen1?.trim() ||
            data.imagen2?.trim() ||
            data.imagen3?.trim() ||
            'assets/img/no-image.png';
        },
        error: (err) => {
          console.error('ERROR detalle', err);
          this.error = err?.error?.message || 'Producto no encontrado';
        }
      });
  }

  cambiarImagen(src?: string) {
    const s = (src || '').trim();
    if (s) this.imagenPrincipal = s;
  }

  precioTexto(): string {
    const p = this.producto;
    if (p?.precio != null) {
      const n = Number(p.precio);
      if (!Number.isNaN(n)) return `S/ ${n.toFixed(2)}`;
    }
    return p?.etiquetaPrecio?.trim() || 'A cotizar';
  }

  imagenes(): string[] {
    const p = this.producto;
    const arr = [p?.imagen1, p?.imagen2, p?.imagen3]
      .map(x => (x || '').trim())
      .filter(x => !!x);

    return Array.from(new Set(arr));
  }
}
