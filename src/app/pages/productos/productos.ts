import {  Component,  OnInit,  ChangeDetectorRef,  Inject,  PLATFORM_ID} from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import {RouterLink, RouterModule} from '@angular/router';
import { NavbarComponent } from '../../core/navbar/navbar';
import { FooterComponent } from '../../core/footer/footer';

import { ProductoService } from '../../core/services/Producto/Producto.service';
import { Producto } from '../../../Model/Producto';

declare const AOS: any;

type Filtro = { label: string; value: string };

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, CommonModule, RouterModule, RouterLink],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class ProductosComponent implements OnInit {

  filtros: Filtro[] = [
    { label: 'Todo', value: 'todo' },
    { label: 'Mesas', value: 'mesas' },
    { label: 'Sillas', value: 'sillas' },
    { label: 'Cocinas', value: 'cocinas' },
    { label: 'Closets', value: 'closets' },
    { label: 'Decoración', value: 'decoracion' },
  ];

  filtroActivo = 'todo';

  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];

  cargando = true;
  error = '';

  constructor(
    private productoService: ProductoService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.cargar();
    }
  }

  cargar(): void {
    this.cargando = true;
    this.error = '';

    this.productoService.listarPublico().subscribe({
      next: (data) => {
        this.productos = data ?? [];
        this.aplicarFiltro(this.filtroActivo);
        this.cargando = false;

        // 🔑 FIX DEFINITIVO
        this.cdr.detectChanges();

        setTimeout(() => {
          if (typeof AOS !== 'undefined') {
            AOS.refreshHard?.();
            AOS.refresh?.();
          }
        }, 0);
      },
      error: (err) => {
        console.error('ERROR catálogo', err);
        this.cargando = false;
        this.error = 'No se pudo cargar los productos.';
        this.cdr.detectChanges();
      },
    });
  }

  setFiltro(value: string): void {
    this.filtroActivo = value;
    this.aplicarFiltro(value);

    setTimeout(() => {
      if (typeof AOS !== 'undefined') {
        AOS.refreshHard?.();
      }
    }, 0);
  }

  private aplicarFiltro(value: string): void {
    if (value === 'todo') {
      this.productosFiltrados = [...this.productos];
      return;
    }

    this.productosFiltrados = this.productos.filter(p =>
      this.norm(p.categoria?.nombre) === value
    );
  }

  img1(p: Producto): string {
    return p.imagen1?.trim() || 'assets/img/no-image.png';
  }

  descCard(p: Producto): string {
    return p.descripcionCard?.trim() || 'Producto artesanal a medida';
  }

  precioTexto(p: Producto): string {
    if (p.precio !== null && p.precio !== undefined) {
      const n = Number(p.precio);
      if (!Number.isNaN(n)) return `S/ ${n.toFixed(2)}`;
    }
    return p.etiquetaPrecio?.trim() || 'A cotizar';
  }

  private norm(s?: string): string {
    return (s || '')
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }
}
