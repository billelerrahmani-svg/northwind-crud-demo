import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { AuthService } from '../services/auth.service';

/**
 * Gestion centralisée des erreurs HTTP : session expirée (401) -> retour à
 * l'écran de connexion, autres erreurs -> toast global (p-toast du layout).
 * L'API renvoie des ProblemDetail (RFC 7807) : leur champ "detail" est
 * affiché tel quel quand il est présent.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  // Fichiers de traduction : ressources statiques, hors périmètre de la
  // gestion d'erreurs de l'API. Les laisser passer sans injecter
  // TranslateService évite une dépendance circulaire avec ce dernier
  // (NG0200), qui empêcherait le chargement des traductions.
  if (req.url.includes('/i18n/')) {
    return next(req);
  }

  const auth = inject(AuthService);
  const router = inject(Router);
  const messageService = inject(MessageService);
  const translate = inject(TranslateService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      // L'écran de connexion affiche lui-même l'erreur d'identifiants.
      if (req.url.includes('/auth/login')) {
        return throwError(() => error);
      }

      if (error.status === 401) {
        // Token absent ou expiré : purge de la session et retour à la connexion.
        auth.clear();
        router.navigate(['/login'], { queryParams: { returnUrl: router.url } });
      } else if (error.status === 403) {
        messageService.add({ severity: 'error', summary: translate.instant('errors.forbidden') });
      } else if (error.status === 0) {
        messageService.add({ severity: 'error', summary: translate.instant('errors.network') });
      } else {
        const detail = error.error?.detail ?? '';
        messageService.add({ severity: 'error', summary: translate.instant('errors.unexpected'), detail });
      }

      return throwError(() => error);
    })
  );
};
