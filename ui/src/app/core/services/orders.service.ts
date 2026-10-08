import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Orders } from '../models/orders.model';
import { PageResponse } from '../models/page-response.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/api/orders`;

  getAll(): Observable<Orders[]> {
    return this.http.get<Orders[]>(this.baseUrl);
  }

  getPage(page: number, size: number, sort?: string, dir?: 'asc' | 'desc', q?: string): Observable<PageResponse<Orders>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (sort) {
      params = params.set('sort', sort).set('dir', dir ?? 'asc');
    }
    if (q) {
      params = params.set('q', q);
    }
    return this.http.get<PageResponse<Orders>>(`${this.baseUrl}/page`, { params });
  }

  getById(orderid: number): Observable<Orders> {
    return this.http.get<Orders>(`${this.baseUrl}/${orderid}`);
  }

  create(entity: Orders): Observable<Orders> {
    return this.http.post<Orders>(this.baseUrl, entity);
  }

  update(orderid: number, entity: Orders): Observable<Orders> {
    return this.http.put<Orders>(`${this.baseUrl}/${orderid}`, entity);
  }

  delete(orderid: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${orderid}`);
  }
}
