import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Suppliers } from '../models/suppliers.model';
import { PageResponse } from '../models/page-response.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SuppliersService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/api/suppliers`;

  getAll(): Observable<Suppliers[]> {
    return this.http.get<Suppliers[]>(this.baseUrl);
  }

  getPage(page: number, size: number, sort?: string, dir?: 'asc' | 'desc', q?: string): Observable<PageResponse<Suppliers>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (sort) {
      params = params.set('sort', sort).set('dir', dir ?? 'asc');
    }
    if (q) {
      params = params.set('q', q);
    }
    return this.http.get<PageResponse<Suppliers>>(`${this.baseUrl}/page`, { params });
  }

  getById(supplierid: number): Observable<Suppliers> {
    return this.http.get<Suppliers>(`${this.baseUrl}/${supplierid}`);
  }

  create(entity: Suppliers): Observable<Suppliers> {
    return this.http.post<Suppliers>(this.baseUrl, entity);
  }

  update(supplierid: number, entity: Suppliers): Observable<Suppliers> {
    return this.http.put<Suppliers>(`${this.baseUrl}/${supplierid}`, entity);
  }

  delete(supplierid: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${supplierid}`);
  }
}
