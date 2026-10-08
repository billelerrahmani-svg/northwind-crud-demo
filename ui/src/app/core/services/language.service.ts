import { Injectable, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNG } from 'primeng/config';

export type AppLang = 'fr' | 'en' | 'ar';

const STORAGE_KEY = 'app_lang';

/**
 * Centralise le changement de langue : ngx-translate, direction du document
 * (RTL pour l'arabe), traduction interne de PrimeNG (paginator, date picker...)
 * et persistance du choix de l'utilisateur.
 */
@Injectable({ providedIn: 'root' })
export class LanguageService {

  private readonly translate = inject(TranslateService);
  private readonly primeng = inject(PrimeNG);

  readonly currentLang = signal<AppLang>(this.readSavedLang());

  constructor() {
    this.applyLanguage(this.currentLang());
  }

  setLanguage(lang: AppLang): void {
    this.currentLang.set(lang);
    this.applyLanguage(lang);
  }

  get isRtl(): boolean {
    return this.currentLang() === 'ar';
  }

  private applyLanguage(lang: AppLang): void {
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    this.translate.use(lang);
    this.translate.get('primeng').subscribe(translation => {
      this.primeng.setTranslation(translation);
    });
  }

  private readSavedLang(): AppLang {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === 'en' || saved === 'ar' ? saved : 'fr';
  }

}
