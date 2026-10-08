import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderDetails } from '../models/order-details.model';
import { PageResponse } from '../models/page-response.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OrderDetailsService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/api/order-details`;

  getAll(): Observable<OrderDetails[]> {
    return this.http.get<OrderDetails[]>(this.baseUrl);
  }

  getPage(page: number, size: number, sort?: string, dir?: 'asc' | 'desc', q?: string): Observable<PageResponse<OrderDetails>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (sort) {
      params = params.set('sort', sort).set('dir', dir ?? 'asc');
    }
    if (q) {
      params = params.set('q', q);
    }
    return this.http.get<PageResponse<OrderDetails>>(`${this.baseUrl}/page`, { params });
  }

  getById(orderid: number, productid: number): Observable<OrderDetails> {
    return this.http.get<OrderDetails>(`${this.baseUrl}/${orderid}/${productid}`);
  }

  create(entity: OrderDetails): Observable<OrderDetails> {
    return this.http.post<OrderDetails>(this.baseUrl, entity);
  }

  update(orderid: number, productid: number, entity: OrderDetails): Observable<OrderDetails> {
    return this.http.put<OrderDetails>(`${this.baseUrl}/${orderid}/${productid}`, entity);
  }

  delete(orderid: number, productid: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${orderid}/${productid}`);
  }
}
