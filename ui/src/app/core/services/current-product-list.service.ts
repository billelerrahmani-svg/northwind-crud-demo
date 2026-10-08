import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CurrentProductList } from '../models/current-product-list.model';
import { PageResponse } from '../models/page-response.model';
import { environment } from '../../../environments/environment';

/** Vue en base : lecture seule (pas de create/update/delete). Régénéré à chaque génération. */
@Injectable({ providedIn: 'root' })
export class CurrentProductListService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/api/current-product-list`;

  getAll(): Observable<CurrentProductList[]> {
    return this.http.get<CurrentProductList[]>(this.baseUrl);
  }

  getPage(page: number, size: number, sort?: string, dir?: 'asc' | 'desc', q?: string): Observable<PageResponse<CurrentProductList>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (sort) {
      params = params.set('sort', sort).set('dir', dir ?? 'asc');
    }
    if (q) {
      params = params.set('q', q);
    }
    return this.http.get<PageResponse<CurrentProductList>>(`${this.baseUrl}/page`, { params });
  }

  getById(productid: number): Observable<CurrentProductList> {
    return this.http.get<CurrentProductList>(`${this.baseUrl}/${productid}`);
  }
}
