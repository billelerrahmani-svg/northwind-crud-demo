 import { Injectable, inject } from '@angular/core';
 import { signal } from '@angular/core';
 import { HttpClient } from '@angular/common/http';
 import { Observable, map, switchMap, tap } from 'rxjs';

 import { environment } from '../../../environments/environment';

 interface LoginResponse {
   token: string;
   tokenType: string;
   role: string | null;
 }

 export interface PermissionSummary {
   httpMethod: string;
   pathPattern: string;
 }

 /** Codes de rôle fixes semés par SecurityBootstrap côté API (d'autres rôles peuvent exister). */
 export const ROLE_ADMIN = '001';

 @Injectable({ providedIn: 'root' })
 export class AuthService {
   private http = inject(HttpClient);
   private readonly apiBaseUrl = environment.apiBaseUrl;

   private static readonly TOKEN_KEY = 'auth_token';
   private static readonly ROLE_KEY = 'auth_role';
   private static readonly PERMISSIONS_KEY = 'auth_permissions';

   readonly authenticated = signal(false);
   readonly role = signal<string | null>(null);
   readonly permissions = signal<PermissionSummary[]>([]);


   constructor() {

       this.loadAuthentication();
       this.loadRole();
       this.loadPermissions();

   }

   private loadAuthentication(): void {

       this.authenticated.set(this.getToken() != null);

   }

   private loadPermissions(): void {

       const raw = localStorage.getItem(AuthService.PERMISSIONS_KEY);

       if (!raw) {
           this.permissions.set([]);
           return;
       }

       this.permissions.set(JSON.parse(raw));

   }

   private loadRole(): void {

       const role = localStorage.getItem(AuthService.ROLE_KEY);

       this.role.set(role);

   }

   getToken(): string | null {
       return localStorage.getItem(AuthService.TOKEN_KEY);
   }

   login(username: string, password: string): Observable<LoginResponse> {
     return this.http.post<LoginResponse>(`${this.apiBaseUrl}/auth/login`, { username, password }).pipe(
       tap(res => {

         localStorage.setItem(AuthService.TOKEN_KEY, res.token);
         localStorage.setItem(AuthService.ROLE_KEY, res.role ?? "");

         this.authenticated.set(true);
         this.role.set(res.role);

       }),
       switchMap(res => this.refreshPermissions().pipe(map(() => res)))
     );
   }

   clear(): void {
        localStorage.removeItem(AuthService.TOKEN_KEY);
        localStorage.removeItem(AuthService.ROLE_KEY);
        localStorage.removeItem(AuthService.PERMISSIONS_KEY);

        this.authenticated.set(false);
        this.role.set(null);
        this.permissions.set([]);
}

   logout(): void {

       this.clear();

   }

   isAuthenticated(): boolean {
     return this.getToken() !== null;
   }

   getRole(): string | null {
     return localStorage.getItem(AuthService.ROLE_KEY) || null;
   }

   /** Zone d'administration : réservée au rôle 001. */
   isAdmin(): boolean {
     return this.getRole() === ROLE_ADMIN;
   }

   /** Recharge les permissions ALLOW du rôle courant (ex: après changement de rôle par un admin). */
   refreshPermissions(): Observable<PermissionSummary[]> {
     return this.http
       .get<PermissionSummary[]>(`${this.apiBaseUrl}/auth/me/permissions`)
       .pipe(
         tap(perms => {
           localStorage.setItem(
             AuthService.PERMISSIONS_KEY,
             JSON.stringify(perms)
           );

           this.permissions.set(perms);
         })
       );
   }

   /**
    * true si le rôle courant a une permission ALLOW couvrant cette méthode/chemin.
    * Utilisé pour n'afficher les boutons Ajouter/Modifier/Supprimer que là où c'est
    * réellement permis, sans coder en dur de règle par rôle.
    */
   hasPermission(method: string, path: string): boolean {

     const perms = this.permissions();

     return perms.some(p =>
       (p.httpMethod === '*' || p.httpMethod === method) &&
       this.matchPattern(p.pathPattern, path)
     );

   }

  hasAnyPermission(...permissions: PermissionSummary[]): boolean {

      return permissions.some(permission =>
          this.hasPermission(
              permission.httpMethod,
              permission.pathPattern
          )
      );

  }

  hasCrudPermission(entity: string): boolean {

      return this.hasAnyPermission(
          { httpMethod: "GET", pathPattern: `/api/${entity}` },
          { httpMethod: "POST", pathPattern: `/api/${entity}` },
          { httpMethod: "PUT", pathPattern: `/api/${entity}/{id}` },
          { httpMethod: "DELETE", pathPattern: `/api/${entity}/{id}` }
      );

  }

   private matchPattern(pattern: string, path: string): boolean {
     const patternSegments = pattern.split('/').filter(Boolean);
     const pathSegments = path.split('/').filter(Boolean);
     if (patternSegments.length !== pathSegments.length) return false;
     return patternSegments.every((seg, i) => seg.startsWith('{') || seg === pathSegments[i]);
   }

       changePassword(oldPassword: string, newPassword: string): Observable<void> {
        return this.http.put<void>(`${this.apiBaseUrl}/auth/me/password`, { oldPassword, newPassword });
      }
}
