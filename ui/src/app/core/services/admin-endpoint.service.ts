import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AppEndpoint } from '../models/endpoint.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminEndpointService {

  private readonly http = inject(HttpClient);

  private readonly baseUrl = `${environment.apiBaseUrl}/admin/endpoints`;

  getAll(): Observable<AppEndpoint[]> {
    return this.http.get<AppEndpoint[]>(this.baseUrl);
  }

}
