import { Rol } from './Rol';

export interface Empleado {
  idEmpleado: number;

  rol?: Rol;

  codigoTrabajador: string;
  nombre: string;
  apellidos: string;
  dni: string;
  correo: string;

  fechaNacimiento: string;     // "YYYY-MM-DD"
  fechaContratacion: string;   // "YYYY-MM-DD"

  direccion?: string;
  genero?: string;
  celular?: string;

  // si tu backend lo manda
  usuario?: {
    idUsuario: number;
    username: string;
    estado: 'ACTIVO' | 'INACTIVO';
  };
}
