import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LineaDiseno } from '../../../../Model/LineadeDiseno';

@Injectable({ providedIn: 'root' })
export class LineaDisenoService {
  private baseUrl = 'https://bakendcarpinteriac.onrender.com/lineadiseno/api';

  constructor(private http: HttpClient) {}

  private authHeaders(): { headers: HttpHeaders } {
    const auth = localStorage.getItem('auth'); // base64 user:pass
    return {
      headers: new HttpHeaders({
        Authorization: auth ? `Basic ${auth}` : '',
      }),
    };
  }

  listar(): Observable<LineaDiseno[]> {
    return this.http.get<LineaDiseno[]>(`${this.baseUrl}/listar`, this.authHeaders());
  }

  buscar(texto: string): Observable<LineaDiseno[]> {
    return this.http.get<LineaDiseno[]>(`${this.baseUrl}/buscar`, {
      ...this.authHeaders(),
      params: { texto },
    });
  }

  registrar(payload: Partial<LineaDiseno>): Observable<LineaDiseno> {
    return this.http.post<LineaDiseno>(`${this.baseUrl}/registrar`, payload, this.authHeaders());
  }

  editar(id: number, payload: Partial<LineaDiseno>): Observable<LineaDiseno> {
    return this.http.put<LineaDiseno>(`${this.baseUrl}/editar/${id}`, payload, this.authHeaders());
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/eliminar/${id}`, this.authHeaders());
  }
}
