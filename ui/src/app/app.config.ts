import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { ConfirmationService, MessageService } from 'primeng/api';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [

    provideZoneChangeDetection({
      eventCoalescing: true
    }),

    provideRouter(
      routes,
      withComponentInputBinding()
    ),

    provideHttpClient(
      withInterceptors([
        authInterceptor,
        errorInterceptor
      ])
    ),

    provideAnimationsAsync(),

    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: '/i18n/',
        suffix: '.json'
      }),
      fallbackLang: 'fr',
      lang: localStorage.getItem('app_lang') ?? 'fr'
    }),

    providePrimeNG({
      theme: {
        preset: Aura
      },
      ripple: true
    }),

    // Fournis une seule fois à la racine : un unique <p-toast>/<p-confirmdialog>
    // dans main-layout.component.html suffit pour toute l'application (évite
    // NG0201 "No provider found" dans les composants qui les injectent sans
    // les fournir eux-mêmes, et évite les popups en double).
    MessageService,
    ConfirmationService

  ]
};
