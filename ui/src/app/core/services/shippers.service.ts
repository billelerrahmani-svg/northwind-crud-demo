import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Shippers } from '../models/shippers.model';
import { PageResponse } from '../models/page-response.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ShippersService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/api/shippers`;

  getAll(): Observable<Shippers[]> {
    return this.http.get<Shippers[]>(this.baseUrl);
  }

  getPage(page: number, size: number, sort?: string, dir?: 'asc' | 'desc', q?: string): Observable<PageResponse<Shippers>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (sort) {
      params = params.set('sort', sort).set('dir', dir ?? 'asc');
    }
    if (q) {
      params = params.set('q', q);
    }
    return this.http.get<PageResponse<Shippers>>(`${this.baseUrl}/page`, { params });
  }

  getById(shipperid: number): Observable<Shippers> {
    return this.http.get<Shippers>(`${this.baseUrl}/${shipperid}`);
  }

  create(entity: Shippers): Observable<Shippers> {
    return this.http.post<Shippers>(this.baseUrl, entity);
  }

  update(shipperid: number, entity: Shippers): Observable<Shippers> {
    return this.http.put<Shippers>(`${this.baseUrl}/${shipperid}`, entity);
  }

  delete(shipperid: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${shipperid}`);
  }
}
