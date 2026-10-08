import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categories } from '../models/categories.model';
import { PageResponse } from '../models/page-response.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/api/categories`;

  getAll(): Observable<Categories[]> {
    return this.http.get<Categories[]>(this.baseUrl);
  }

  getPage(page: number, size: number, sort?: string, dir?: 'asc' | 'desc', q?: string): Observable<PageResponse<Categories>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (sort) {
      params = params.set('sort', sort).set('dir', dir ?? 'asc');
    }
    if (q) {
      params = params.set('q', q);
    }
    return this.http.get<PageResponse<Categories>>(`${this.baseUrl}/page`, { params });
  }

  getById(categoryid: number): Observable<Categories> {
    return this.http.get<Categories>(`${this.baseUrl}/${categoryid}`);
  }

  create(entity: Categories): Observable<Categories> {
    return this.http.post<Categories>(this.baseUrl, entity);
  }

  update(categoryid: number, entity: Categories): Observable<Categories> {
    return this.http.put<Categories>(`${this.baseUrl}/${categoryid}`, entity);
  }

  delete(categoryid: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${categoryid}`);
  }
}
