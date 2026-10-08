import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AppApiKey, ApiKeyCreated } from '../models/api-key.model';
import { PermissionRow } from '../../shared/permission-matrix/permission-matrix.component';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminApiKeyService {

  private readonly http = inject(HttpClient);

  private readonly baseUrl = `${environment.apiBaseUrl}/admin/api-keys`;

  getAll(): Observable<AppApiKey[]> {
    return this.http.get<AppApiKey[]>(this.baseUrl);
  }

  create(apiKey: Partial<AppApiKey>): Observable<ApiKeyCreated> {
    return this.http.post<ApiKeyCreated>(this.baseUrl, apiKey);
  }

  update(
    id: number,
    apiKey: Partial<AppApiKey>
  ): Observable<AppApiKey> {
    return this.http.put<AppApiKey>(
      `${this.baseUrl}/${id}`,
      apiKey
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
