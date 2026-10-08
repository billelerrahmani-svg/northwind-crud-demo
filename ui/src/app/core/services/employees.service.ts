import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employees } from '../models/employees.model';
import { PageResponse } from '../models/page-response.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EmployeesService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/api/employees`;

  getAll(): Observable<Employees[]> {
    return this.http.get<Employees[]>(this.baseUrl);
  }

  getPage(page: number, size: number, sort?: string, dir?: 'asc' | 'desc', q?: string): Observable<PageResponse<Employees>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (sort) {
      params = params.set('sort', sort).set('dir', dir ?? 'asc');
    }
    if (q) {
      params = params.set('q', q);
    }
    return this.http.get<PageResponse<Employees>>(`${this.baseUrl}/page`, { params });
  }

  getById(employeeid: number): Observable<Employees> {
    return this.http.get<Employees>(`${this.baseUrl}/${employeeid}`);
  }

  create(entity: Employees): Observable<Employees> {
    return this.http.post<Employees>(this.baseUrl, entity);
  }

  update(employeeid: number, entity: Employees): Observable<Employees> {
    return this.http.put<Employees>(`${this.baseUrl}/${employeeid}`, entity);
  }

  delete(employeeid: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${employeeid}`);
  }
}
