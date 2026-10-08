import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AppRole } from '../models/role.model';
import { PermissionRow } from '../../shared/permission-matrix/permission-matrix.component';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminRoleService {

  private readonly http = inject(HttpClient);

  private readonly baseUrl = `${environment.apiBaseUrl}/admin/roles`;

  getAll(): Observable<AppRole[]> {
    return this.http.get<AppRole[]>(this.baseUrl);
  }

  create(role: {
    userrole: string;
    designation: string;
  }): Observable<AppRole> {
    return this.http.post<AppRole>(this.baseUrl, role);
  }

  update(
    id: number,
    designation: string
  ): Observable<AppRole> {
    return this.http.put<AppRole>(
      `${this.baseUrl}/${id}`,
      { designation }
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/${id}`
    );
  }

  getPermissions(id: number): Observable<PermissionRow[]> {
    return this.http.get<PermissionRow[]>(
      `${this.baseUrl}/${id}/permissions`
    );
  }

  setPermissions(
    id: number,
    rows: PermissionRow[]
  ): Observable<void> {
    return this.http.put<void>(
      `${this.baseUrl}/${id}/permissions`,
      rows
    );
  }

}
