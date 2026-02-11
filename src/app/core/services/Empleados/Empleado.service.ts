import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Empleado } from '../../../../Model/Empleado';

@Injectable({ providedIn: 'root' })
export class EmpleadoService {
  private baseUrl = 'https://bakendcarpinteriac.onrender.com/api/empleados';

  constructor(private http: HttpClient) {}

  private authHeaders(): { headers: HttpHeaders } {
    const auth =
      typeof window !== 'undefined' ? localStorage.getItem('auth') : null;

    return {
      headers: new HttpHeaders({
        Authorization: auth ? `Basic ${auth}` : '',
      }),
    };
  }

  listar(): Observable<Empleado[]> {
    return this.http.get<Empleado[]>(this.baseUrl, this.authHeaders());
  }
  // 🔍 buscar por texto + rol
  buscar(texto?: string, idRol?: number): Observable<Empleado[]> {
    return this.http.get<Empleado[]>(`${this.baseUrl}/buscar`, {
      ...this.authHeaders(),
      params: {
        texto: texto ?? '',
        idRol: idRol ? idRol.toString() : '',
      },
    });
  }

  registrar(payload: Partial<Empleado>): Observable<Empleado> {
    return this.http.post<Empleado>(this.baseUrl, payload, this.authHeaders());
  }

  actualizar(id: number, payload: Partial<Empleado>): Observable<Empleado> {
    return this.http.put<Empleado>(
      `${this.baseUrl}/${id}`,
      payload,
      this.authHeaders()
    );
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/${id}`,
      this.authHeaders()
    );
  }
}

