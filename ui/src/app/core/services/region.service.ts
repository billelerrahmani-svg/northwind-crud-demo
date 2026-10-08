import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Region } from '../models/region.model';
import { PageResponse } from '../models/page-response.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RegionService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/api/region`;

  getAll(): Observable<Region[]> {
    return this.http.get<Region[]>(this.baseUrl);
  }

  getPage(page: number, size: number, sort?: string, dir?: 'asc' | 'desc', q?: string): Observable<PageResponse<Region>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (sort) {
      params = params.set('sort', sort).set('dir', dir ?? 'asc');
    }
    if (q) {
      params = params.set('q', q);
    }
    return this.http.get<PageResponse<Region>>(`${this.baseUrl}/page`, { params });
  }

  getById(regionid: number): Observable<Region> {
    return this.http.get<Region>(`${this.baseUrl}/${regionid}`);
  }

  create(entity: Region): Observable<Region> {
    return this.http.post<Region>(this.baseUrl, entity);
  }

  update(regionid: number, entity: Region): Observable<Region> {
    return this.http.put<Region>(`${this.baseUrl}/${regionid}`, entity);
  }

  delete(regionid: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${regionid}`);
  }
}
