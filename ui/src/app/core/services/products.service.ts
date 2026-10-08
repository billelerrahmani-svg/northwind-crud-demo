import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Products } from '../models/products.model';
import { PageResponse } from '../models/page-response.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/api/products`;

  getAll(): Observable<Products[]> {
    return this.http.get<Products[]>(this.baseUrl);
  }

  getPage(page: number, size: number, sort?: string, dir?: 'asc' | 'desc', q?: string): Observable<PageResponse<Products>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (sort) {
      params = params.set('sort', sort).set('dir', dir ?? 'asc');
    }
    if (q) {
      params = params.set('q', q);
    }
    return this.http.get<PageResponse<Products>>(`${this.baseUrl}/page`, { params });
  }

  getById(productid: number): Observable<Products> {
    return this.http.get<Products>(`${this.baseUrl}/${productid}`);
  }

  create(entity: Products): Observable<Products> {
    return this.http.post<Products>(this.baseUrl, entity);
  }

  update(productid: number, entity: Products): Observable<Products> {
    return this.http.put<Products>(`${this.baseUrl}/${productid}`, entity);
  }

  delete(productid: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${productid}`);
  }
}
