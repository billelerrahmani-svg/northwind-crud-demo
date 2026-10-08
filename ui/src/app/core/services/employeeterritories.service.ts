import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employeeterritories } from '../models/employeeterritories.model';
import { PageResponse } from '../models/page-response.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EmployeeterritoriesService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/api/employeeterritories`;

  getAll(): Observable<Employeeterritories[]> {
    return this.http.get<Employeeterritories[]>(this.baseUrl);
  }

  getPage(page: number, size: number, sort?: string, dir?: 'asc' | 'desc', q?: string): Observable<PageResponse<Employeeterritories>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (sort) {
      params = params.set('sort', sort).set('dir', dir ?? 'asc');
    }
    if (q) {
      params = params.set('q', q);
    }
    return this.http.get<PageResponse<Employeeterritories>>(`${this.baseUrl}/page`, { params });
  }

  getById(employeeid: number, territoryid: string): Observable<Employeeterritories> {
    return this.http.get<Employeeterritories>(`${this.baseUrl}/${employeeid}/${territoryid}`);
  }

  create(entity: Employeeterritories): Observable<Employeeterritories> {
    return this.http.post<Employeeterritories>(this.baseUrl, entity);
  }

  update(employeeid: number, territoryid: string, entity: Employeeterritories): Observable<Employeeterritories> {
    return this.http.put<Employeeterritories>(`${this.baseUrl}/${employeeid}/${territoryid}`, entity);
  }

  delete(employeeid: number, territoryid: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${employeeid}/${territoryid}`);
  }
}
