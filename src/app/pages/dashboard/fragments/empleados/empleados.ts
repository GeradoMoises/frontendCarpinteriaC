import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Empleado } from '../../../../../Model/Empleado';
import { Rol } from '../../../../../Model/Rol';

import { EmpleadoService } from '../../../../core/services/Empleados/Empleado.service';
import { RolService } from '../../../../core/services/Rol/rol.service';

@Component({
  selector: 'app-empleados',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './empleados.html',
  styleUrl: './empleados.css',
})
export class EmpleadosComponent implements OnInit {
  // ================= LISTAS =================
  empleados: Empleado[] = [];
  roles: Rol[] = [];

  loading = false;
  error = '';

  // ================= FORM CREAR =================
  form = {
    codigoTrabajador: '',
    idRol: '',
    dni: '',
    celular: '',
    nombre: '',
    apellidos: '',
    correo: '',
    fechaNacimiento: '',
    fechaContratacion: '',
    genero: '',
    direccion: '',
  };

  // ================= FORM EDITAR =================
  edit = {
    idEmpleado: 0,
    codigoTrabajador: '',
    idRol: '',
    dni: '',
    celular: '',
    nombre: '',
    apellidos: '',
    correo: '',
    fechaNacimiento: '',
    fechaContratacion: '',
    genero: '',
    direccion: '',
  };

  // ================= FILTROS =================
  textoBuscar = '';
  filtroRol = '';

  constructor(
    private empleadoApi: EmpleadoService,
    private rolApi: RolService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarRoles();
    this.listar();
  }

  // ================= ROLES =================
  cargarRoles(): void {
    this.rolApi.listar().subscribe({
      next: (d: Rol[]) => {
        this.roles = d || [];
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'No se pudo cargar roles (¿existe /api/roles en backend?)';
      },
    });
  }

  // ================= LISTAR =================
// ================= LISTAR / BUSCAR =================
  listar(): void {
    this.loading = true;
    this.error = '';

    const texto = this.textoBuscar?.trim();
    const idRol = this.filtroRol ? Number(this.filtroRol) : undefined;

    // 🔍 si hay filtros → buscar
    if (texto || idRol) {
      this.empleadoApi.buscar(texto, idRol).subscribe({
        next: (d: Empleado[]) => {
          this.empleados = d || [];
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.loading = false;
          this.error = err?.error?.message || 'No se pudo buscar empleados';
          console.error(err);
        },
      });
      return;
    }

    // 📋 si NO hay filtros → listar todo
    this.empleadoApi.listar().subscribe({
      next: (d: Empleado[]) => {
        this.empleados = d || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'No se pudo listar empleados';
        console.error(err);
      },
    });
  }



  // ================= CREAR =================
  guardar(): void {
    this.error = '';

    if (!this.form.codigoTrabajador || !this.form.idRol) {
      this.error = 'Código y Rol son obligatorios';
      return;
    }

    const payload: any = {
      codigoTrabajador: this.form.codigoTrabajador,
      dni: this.form.dni,
      celular: this.form.celular || null,
      nombre: this.form.nombre,
      apellidos: this.form.apellidos,
      correo: this.form.correo,
      fechaNacimiento: this.form.fechaNacimiento,
      fechaContratacion: this.form.fechaContratacion,
      genero: this.form.genero || null,
      direccion: this.form.direccion || null,
      rol: { idRol: Number(this.form.idRol) },
    };

    this.empleadoApi.registrar(payload).subscribe({
      next: () => {
        this.resetForm();
        this.listar();
      },
      error: (err) => {
        this.error = err?.error || 'Error al registrar empleado';
      },
    });
  }

  // ================= EDITAR =================
  abrirEditar(e: Empleado): void {
    this.edit.idEmpleado = e.idEmpleado;
    this.edit.codigoTrabajador = e.codigoTrabajador;
    this.edit.idRol = String(e.rol?.idRol || '');
    this.edit.dni = e.dni;
    this.edit.celular = e.celular || '';
    this.edit.nombre = e.nombre;
    this.edit.apellidos = e.apellidos;
    this.edit.correo = e.correo;
    this.edit.fechaNacimiento = e.fechaNacimiento;
    this.edit.fechaContratacion = e.fechaContratacion;
    this.edit.genero = e.genero || '';
    this.edit.direccion = e.direccion || '';
  }

  actualizar(): void {
    this.error = '';

    const payload: any = {
      codigoTrabajador: this.edit.codigoTrabajador,
      dni: this.edit.dni,
      celular: this.edit.celular || null,
      nombre: this.edit.nombre,
      apellidos: this.edit.apellidos,
      correo: this.edit.correo,
      fechaNacimiento: this.edit.fechaNacimiento,
      fechaContratacion: this.edit.fechaContratacion,
      genero: this.edit.genero || null,
      direccion: this.edit.direccion || null,
      rol: { idRol: Number(this.edit.idRol) },
    };

    this.empleadoApi.actualizar(this.edit.idEmpleado, payload).subscribe({
      next: () => this.listar(),
      error: (err) => {
        this.error = err?.error || 'Error al actualizar empleado';
      },
    });
  }

  // ================= ELIMINAR =================
  eliminar(id: number): void {
    if (!confirm('¿Seguro de eliminar este empleado?')) return;

    this.empleadoApi.eliminar(id).subscribe({
      next: () => this.listar(),
      error: (err) => {
        this.error = err?.error || 'No se pudo eliminar empleado';
      },
    });
  }

  resetForm(): void {
    this.form = {
      codigoTrabajador: '',
      idRol: '',
      dni: '',
      celular: '',
      nombre: '',
      apellidos: '',
      correo: '',
      fechaNacimiento: '',
      fechaContratacion: '',
      genero: '',
      direccion: '',
    };
  }
}
