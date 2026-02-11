export interface Login {
  idUsuario: number;
  username: string;
  estado: string; // 👈 usa string para evitar errores
  rol: string;   // ✅ ESTO ES CLAVE

}
