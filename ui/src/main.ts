import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import localeAr from '@angular/common/locales/ar';
registerLocaleData(localeAr, 'ar');
registerLocaleData(localeFr, 'fr-FR');

// Applique la langue/direction sauvegardée avant même le bootstrap Angular,
// pour éviter un flash LTR->RTL au premier affichage en arabe.
const savedLang = localStorage.getItem('app_lang') ?? 'fr';
document.documentElement.lang = savedLang;
document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';

bootstrapApplication(AppComponent, appConfig)
  .catch(error => {
    console.error('Erreur lors du démarrage de l\'application', error);
  });
