import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customers } from '../models/customers.model';
import { PageResponse } from '../models/page-response.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CustomersService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/api/customers`;

  getAll(): Observable<Customers[]> {
    return this.http.get<Customers[]>(this.baseUrl);
  }

  getPage(page: number, size: number, sort?: string, dir?: 'asc' | 'desc', q?: string): Observable<PageResponse<Customers>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (sort) {
      params = params.set('sort', sort).set('dir', dir ?? 'asc');
    }
    if (q) {
      params = params.set('q', q);
    }
    return this.http.get<PageResponse<Customers>>(`${this.baseUrl}/page`, { params });
  }

  getById(customerid: string): Observable<Customers> {
    return this.http.get<Customers>(`${this.baseUrl}/${customerid}`);
  }

  create(entity: Customers): Observable<Customers> {
    return this.http.post<Customers>(this.baseUrl, entity);
  }

  update(customerid: string, entity: Customers): Observable<Customers> {
    return this.http.put<Customers>(`${this.baseUrl}/${customerid}`, entity);
  }

  delete(customerid: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${customerid}`);
  }
}
