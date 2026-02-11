import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria } from '../../../../Model/Categoria';

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private baseUrl = 'https://bakendcarpinteriac.onrender.com/categoria/api';

  constructor(private http: HttpClient) {}

  private authHeaders(): { headers: HttpHeaders } {
    const auth = localStorage.getItem('auth'); // Basic base64(user:pass)
    return {
      headers: new HttpHeaders({
        Authorization: auth ? `Basic ${auth}` : '',
      }),
    };
  }

  listar(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.baseUrl}/listar`, this.authHeaders());
  }

  buscar(texto: string): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.baseUrl}/buscar`, {
      ...this.authHeaders(),
      params: { texto },
    });
  }

  registrar(payload: Partial<Categoria>): Observable<Categoria> {
    return this.http.post<Categoria>(`${this.baseUrl}/registrar`, payload, this.authHeaders());
  }

  editar(id: number, payload: Partial<Categoria>): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.baseUrl}/editar/${id}`, payload, this.authHeaders());
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/eliminar/${id}`, this.authHeaders());
  }
}
