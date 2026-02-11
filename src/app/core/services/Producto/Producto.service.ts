import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../../../../Model/Producto';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private baseUrl = 'https://bakendcarpinteriac.onrender.com/producto/api';

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

  listar(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.baseUrl}/listar`, this.authHeaders());
  }

  buscar(texto: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.baseUrl}/buscar`, {
      ...this.authHeaders(),
      params: { texto },
    });
  }

  buscarPorCategoria(idCategoria: number): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.baseUrl}/buscar-categoria`, {
      ...this.authHeaders(),
      params: { idCategoria },
    });
  }

  buscarPorId(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.baseUrl}/buscar/${id}`, this.authHeaders());
  }

  registrar(payload: Partial<Producto>): Observable<Producto> {
    return this.http.post<Producto>(`${this.baseUrl}/registrar`, payload, this.authHeaders());
  }

  editar(id: number, payload: Partial<Producto>): Observable<Producto> {
    return this.http.put<Producto>(`${this.baseUrl}/editar/${id}`, payload, this.authHeaders());
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/eliminar/${id}`, this.authHeaders());
  }
  // ================== CATÁLOGO PÚBLICO ==================
  listarPublico(): Observable<Producto[]> {
    return this.http.get<Producto[]>(
      'https://bakendcarpinteriac.onrender.com/producto/public/listar'
    );
  }
  buscarPublicoPorId(id: number): Observable<Producto> {
    return this.http.get<Producto>(`https://bakendcarpinteriac.onrender.com/producto/public/${id}`);
  }




}
