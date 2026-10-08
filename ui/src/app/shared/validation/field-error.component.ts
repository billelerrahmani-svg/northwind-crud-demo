import { Component, inject, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

/**
 * Message d'erreur d'un champ de formulaire, affiché sous le contrôle une
 * fois celui-ci touché ou modifié.
 *
 * Stratégie de détection par défaut (volontaire, alors que les composants
 * générés sont en OnPush) : la référence du contrôle passé en entrée ne
 * change jamais, seul son état interne évolue à la saisie. Ce composant
 * doit donc rester revérifié avec la vue parente.
 */
@Component({
  selector: 'app-field-error',
  standalone: true,
  template: `@if (message(); as text) {<small class="field-error">{{ text }}</small>}`
})
export class FieldErrorComponent {
  private readonly translate = inject(TranslateService);

  readonly control = input<AbstractControl | null>(null);

  message(): string | null {
    const control = this.control();
    if (!control || !control.errors || !(control.touched || control.dirty)) {
      return null;
    }
    const errors = control.errors;
    if (errors['required']) {
      return this.translate.instant('validation.required');
    }
    if (errors['exactLength']) {
      return this.translate.instant('validation.exactLength', { length: errors['exactLength'].requiredLength });
    }
    if (errors['maxlength']) {
      return this.translate.instant('validation.maxLength', { max: errors['maxlength'].requiredLength });
    }
    if (errors['min']) {
      return this.translate.instant('validation.min', { min: errors['min'].min });
    }
    if (errors['max']) {
      return this.translate.instant('validation.max', { max: errors['max'].max });
    }
    if (errors['pattern']) {
      return this.translate.instant('validation.pattern');
    }
    return null;
  }
}
