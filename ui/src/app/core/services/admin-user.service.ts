import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AppUser } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminUserService {

  private readonly http = inject(HttpClient);

  private readonly baseUrl = `${environment.apiBaseUrl}/admin/users`;

  getAll(): Observable<AppUser[]> {
    return this.http.get<AppUser[]>(this.baseUrl);
  }

  create(user: AppUser): Observable<AppUser> {
    return this.http.post<AppUser>(this.baseUrl, user);
  }

  update(
    id: number,
    user: {
      roleId: number | null;
      enabled: boolean;
    }
  ): Observable<AppUser> {
    return this.http.put<AppUser>(
      `${this.baseUrl}/${id}`,
      user
    );
  }

  resetPassword(
    id: number,
    newPassword: string
  ): Observable<void> {
    return this.http.put<void>(
      `${this.baseUrl}/${id}/password`,
      { newPassword }
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/${id}`
    );
  }

}
