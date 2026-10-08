import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Longueur exacte, pour les colonnes CHAR(n)/NCHAR(n) dont la valeur est
 * complétée par des espaces en base : une valeur vide reste valide (c'est
 * Validators.required qui porte le caractère obligatoire), une valeur
 * saisie doit faire exactement n caractères.
 */
export function exactLength(length: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value === null || value === undefined || value === '') {
      return null;
    }
    const actualLength = String(value).length;
    return actualLength === length
      ? null
      : { exactLength: { requiredLength: length, actualLength } };
  };
}
