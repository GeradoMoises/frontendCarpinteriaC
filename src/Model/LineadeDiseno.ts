export interface LineaDiseno {
  id: number;
  nombre: string;
  descripcion?: string;
  imagen?: string;
  activo: boolean;
  fechaCreacion?: string; // viene como string ISO desde el backend
}
