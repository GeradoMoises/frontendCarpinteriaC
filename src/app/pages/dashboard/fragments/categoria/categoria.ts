import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Categoria } from '../../../../../Model/Categoria';
import { CategoriaService } from '../../../../core/services/Categoria/Categoria.service';

@Component({
  selector: 'app-categoria',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categoria.html',
  styleUrl: './categoria.css',
})
export class CategoriaComponent implements OnInit {
  categorias: Categoria[] = [];
  loading = false;
  error = '';

  // form crear
  nombre = '';
  descripcion = '';
  activo: '1' | '0' = '1';

  // buscar
  texto = '';

  // modal editar
  editId = 0;
  editNombre = '';
  editDescripcion = '';
  editActivo: '1' | '0' = '1';

  constructor(
    private api: CategoriaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.loading = true;
    this.error = '';
    this.api.listar().subscribe({
      next: (data) => {
        this.categorias = data;
        this.loading = false;
        this.cdr.detectChanges(); // ✅ evita que “solo pinte al interactuar”
      },
      error: (err) => {
        this.error = 'No se pudo cargar categorías';
        this.loading = false;
        console.error(err);
        this.cdr.detectChanges();
      },
    });
  }

  guardar(): void {
    if (!this.nombre.trim()) {
      this.error = 'El nombre es obligatorio';
      return;
    }

    this.error = '';
    this.api.registrar({
      nombre: this.nombre.trim(),
      descripcion: (this.descripcion || '').trim(),
      activo: this.activo === '1',
    }).subscribe({
      next: () => {
        this.nombre = '';
        this.descripcion = '';
        this.activo = '1';
        this.cargar();
      },
      error: (err) => {
        this.error = err?.error?.message || 'No se pudo registrar';
        console.error(err);
      },
    });
  }

  buscar(): void {
    const t = this.texto.trim();
    if (!t) {
      this.cargar();
      return;
    }

    this.api.buscar(t).subscribe({
      next: (data) => {
        this.categorias = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'No se pudo buscar';
        console.error(err);
      },
    });
  }

  abrirEditar(c: Categoria): void {
    this.editId = c.id;
    this.editNombre = c.nombre;
    this.editDescripcion = c.descripcion || '';
    this.editActivo = c.activo ? '1' : '0';
  }

  actualizar(): void {
    if (!this.editNombre.trim()) {
      this.error = 'El nombre es obligatorio';
      return;
    }

    this.error = '';
    this.api.editar(this.editId, {
      nombre: this.editNombre.trim(),
      descripcion: (this.editDescripcion || '').trim(),
      activo: this.editActivo === '1',
    }).subscribe({
      next: () => this.cargar(),
      error: (err) => {
        this.error = err?.error?.message || 'No se pudo actualizar';
        console.error(err);
      },
    });
  }

  eliminar(id: number): void {
    if (!confirm('¿Seguro que deseas eliminar esta categoría?')) return;

    this.error = '';
    this.api.eliminar(id).subscribe({
      next: () => this.cargar(),
      error: (err) => {
        this.error = 'No se pudo eliminar';
        console.error(err);
      },
    });
  }

  refresh(): void {
    this.cargar();
  }
}
