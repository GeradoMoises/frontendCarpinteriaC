import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Producto } from '../../../../../Model/Producto';
import { Categoria } from '../../../../../Model/Categoria';
import { LineaDiseno } from '../../../../../Model/LineadeDiseno';

import { ProductoService } from '../../../../core/services/Producto/Producto.service';
import { CategoriaService } from '../../../../core/services/Categoria/Categoria.service';
import { LineaDisenoService } from '../../../../core/services/LineadeDiseno/linea-diseno.service';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class ProductosComponent implements OnInit {

  // ================= LISTAS =================
  productos: Producto[] = [];
  categorias: Categoria[] = [];
  lineas: LineaDiseno[] = [];

  loading = false;
  error = '';

  // ================= FORM CREAR =================
  form = {
    nombre: '',
    idCategoria: '',
    idLinea: '',
    precio: '' as string | number,
    largo: '' as string | number,
    ancho: '' as string | number,
    alto: '' as string | number,
    peso: '' as string | number,
    activo: '1' as '1' | '0',
    material: '',
    descripcionCard: '',
    descripcionCorta: '',
    descripcionLarga: '',
    imagen1: '',
    imagen2: '',
    imagen3: '',
  };

  // ================= FORM EDITAR (🔴 AQUÍ VA) =================
  edit = {
    id: 0,
    nombre: '',
    idCategoria: '',
    idLinea: '',
    precio: '' as any,
    etiquetaPrecio: '',
    largo: '' as any,
    ancho: '' as any,
    altura: '' as any,
    peso: '' as any,
    material: '',
    imagen1: '',
    imagen2: '',
    imagen3: '',
    descripcionCard: '',
    descripcionCorta: '',
    descripcionLarga: '',
    activo: true,
  };

  // ================= FILTROS =================
  textoBuscar = '';
  filtroCategoria = '';

  constructor(
    private productosApi: ProductoService,
    private categoriaApi: CategoriaService,
    private lineaApi: LineaDisenoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarCombos();
    this.listar();
  }

  // ================= COMBOS =================
  cargarCombos(): void {
    this.categoriaApi.listar().subscribe({
      next: d => { this.categorias = d || []; this.cdr.detectChanges(); }
    });

    this.lineaApi.listar().subscribe({
      next: d => { this.lineas = d || []; this.cdr.detectChanges(); }
    });
  }

  // ================= LISTAR =================
  listar(): void {
    this.loading = true;
    this.productosApi.listar().subscribe({
      next: d => {
        this.productos = d || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'No se pudo listar productos';
        this.loading = false;
      }
    });
  }

  // ================= BUSCAR =================
  buscar(): void {
    if (!this.textoBuscar && !this.filtroCategoria) {
      this.listar();
      return;
    }

    if (this.filtroCategoria) {
      this.buscarPorCategoria();
      return;
    }

    this.productosApi.buscar(this.textoBuscar).subscribe({
      next: d => this.productos = d || []
    });
  }

  buscarPorCategoria(): void {
    const id = Number(this.filtroCategoria);
    if (!id) { this.listar(); return; }

    this.productosApi.buscarPorCategoria(id).subscribe({
      next: d => this.productos = d || []
    });
  }

  // ================= CREAR =================
  guardarProducto(): void {
    if (!this.form.nombre || !this.form.idCategoria) {
      this.error = 'Nombre y categoría son obligatorios';
      return;
    }

    const payload: any = {
      nombre: this.form.nombre,
      descripcionCard: this.form.descripcionCard,
      descripcionCorta: this.form.descripcionCorta,
      descripcionLarga: this.form.descripcionLarga,
      material: this.form.material,
      imagen1: this.form.imagen1,
      imagen2: this.form.imagen2,
      imagen3: this.form.imagen3,
      activo: this.form.activo === '1',
      precio: this.form.precio ? Number(this.form.precio) : null,
      largo: this.form.largo ? Number(this.form.largo) : null,
      ancho: this.form.ancho ? Number(this.form.ancho) : null,
      altura: this.form.alto ? Number(this.form.alto) : null,
      peso: this.form.peso ? Number(this.form.peso) : null,
      categoria: { id: Number(this.form.idCategoria) },
      lineaDiseno: this.form.idLinea ? { id: Number(this.form.idLinea) } : null,
    };

    this.productosApi.registrar(payload).subscribe({
      next: () => {
        this.resetForm();
        this.listar();
      }
    });
  }

  // ================= EDITAR =================
  abrirEditar(p: Producto): void {
    this.edit.id = p.id;
    this.edit.nombre = p.nombre;
    this.edit.idCategoria = String(p.categoria?.id || '');
    this.edit.idLinea = String(p.lineaDiseno?.id || '');
    this.edit.precio = p.precio ?? '';
    this.edit.etiquetaPrecio = p.etiquetaPrecio || '';
    this.edit.largo = p.largo ?? '';
    this.edit.ancho = p.ancho ?? '';
    this.edit.altura = p.altura ?? '';
    this.edit.peso = p.peso ?? '';
    this.edit.material = p.material || '';
    this.edit.imagen1 = p.imagen1 || '';
    this.edit.imagen2 = p.imagen2 || '';
    this.edit.imagen3 = p.imagen3 || '';
    this.edit.descripcionCard = p.descripcionCard || '';
    this.edit.descripcionCorta = p.descripcionCorta || '';
    this.edit.descripcionLarga = p.descripcionLarga || '';
    this.edit.activo = p.activo !== false;
  }

  actualizar(): void {
    const payload: any = {
      nombre: this.edit.nombre,
      descripcionCard: this.edit.descripcionCard,
      descripcionCorta: this.edit.descripcionCorta,
      descripcionLarga: this.edit.descripcionLarga,
      material: this.edit.material,
      imagen1: this.edit.imagen1,
      imagen2: this.edit.imagen2,
      imagen3: this.edit.imagen3,
      activo: this.edit.activo,
      precio: this.edit.precio || null,
      largo: this.edit.largo || null,
      ancho: this.edit.ancho || null,
      altura: this.edit.altura || null,
      peso: this.edit.peso || null,
      categoria: { id: Number(this.edit.idCategoria) },
      lineaDiseno: this.edit.idLinea ? { id: Number(this.edit.idLinea) } : null,
    };

    this.productosApi.editar(this.edit.id, payload).subscribe({
      next: () => this.listar()
    });
  }

  // ================= ELIMINAR =================
  eliminar(id: number): void {
    if (!confirm('¿Eliminar producto?')) return;
    this.productosApi.eliminar(id).subscribe(() => this.listar());
  }

  // ================= HELPERS =================
  estadoTexto(p: Producto): string {
    return p.activo ? 'Activo' : 'Inactivo';
  }

  precioTexto(p: Producto): string {
    return p.precio ? `S/ ${p.precio}` : p.etiquetaPrecio || 'A cotizar';
  }

  resetForm(): void {
    this.form = {
      nombre: '',
      idCategoria: '',
      idLinea: '',
      precio: '',
      largo: '',
      ancho: '',
      alto: '',
      peso: '',
      activo: '1',
      material: '',
      descripcionCard: '',
      descripcionCorta: '',
      descripcionLarga: '',
      imagen1: '',
      imagen2: '',
      imagen3: '',
    };
  }
}
