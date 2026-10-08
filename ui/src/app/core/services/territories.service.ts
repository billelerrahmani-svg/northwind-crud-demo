import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Territories } from '../models/territories.model';
import { PageResponse } from '../models/page-response.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TerritoriesService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/api/territories`;

  getAll(): Observable<Territories[]> {
    return this.http.get<Territories[]>(this.baseUrl);
  }

  getPage(page: number, size: number, sort?: string, dir?: 'asc' | 'desc', q?: string): Observable<PageResponse<Territories>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (sort) {
      params = params.set('sort', sort).set('dir', dir ?? 'asc');
    }
    if (q) {
      params = params.set('q', q);
    }
    return this.http.get<PageResponse<Territories>>(`${this.baseUrl}/page`, { params });
  }

  getById(territoryid: string): Observable<Territories> {
    return this.http.get<Territories>(`${this.baseUrl}/${territoryid}`);
  }

  create(entity: Territories): Observable<Territories> {
    return this.http.post<Territories>(this.baseUrl, entity);
  }

  update(territoryid: string, entity: Territories): Observable<Territories> {
    return this.http.put<Territories>(`${this.baseUrl}/${territoryid}`, entity);
  }

  delete(territoryid: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${territoryid}`);
  }
}
