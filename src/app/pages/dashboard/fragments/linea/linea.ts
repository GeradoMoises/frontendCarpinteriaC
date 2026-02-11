import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LineaDiseno } from '../../../../../Model/LineadeDiseno';
import { LineaDisenoService } from '../../../../core/services/LineadeDiseno/linea-diseno.service';

@Component({
  selector: 'app-linea',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './linea.html',
  styleUrl: './linea.css',
})
export class LineaComponent implements OnInit {

  lineas: LineaDiseno[] = [];
  loading = false;
  error = '';

  // ====== FORM CREAR ======
  nombre = '';
  activo: '1' | '0' = '1';
  descripcion = '';

  // ====== BUSCADOR ======
  texto = '';

  // ====== MODAL EDITAR ======
  editId = 0;
  editNombre = '';
  editDescripcion = '';
  editActivo: '1' | '0' = '1';

  constructor(
    private api: LineaDisenoService,
    private cdr: ChangeDetectorRef // ✅ CLAVE
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.loading = true;
    this.error = '';

    this.api.listar().subscribe({
      next: (data) => {
        this.lineas = data;
        this.loading = false;

        // ✅ FUERZA EL RENDER AUTOMÁTICO
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'No se pudo cargar las líneas';
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
        this.lineas = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err),
    });
  }

  abrirEditar(l: LineaDiseno): void {
    this.editId = l.id;
    this.editNombre = l.nombre;
    this.editDescripcion = l.descripcion || '';
    this.editActivo = l.activo ? '1' : '0';
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
    if (!confirm('¿Seguro que deseas eliminar esta línea?')) return;

    this.error = '';
    this.api.eliminar(id).subscribe({
      next: () => this.cargar(),
      error: (err) => {
        this.error = 'No se pudo eliminar';
        console.error(err);
      },
    });
  }

  // ====== USADO POR EL DASHBOARD ======
  refresh(): void {
    this.cargar();
  }
}
