import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FieldErrorComponent } from '../../shared/validation/field-error.component';
import { TranslatePipe } from '@ngx-translate/core';

import { Suppliers } from '../../core/models/suppliers.model';
import { SuppliersService } from '../../core/services/suppliers.service';

/**
 * Page dédiée d'ajout/modification (remplace le formulaire en dialog).
 * Personnalisez librement ce composant : il n'est jamais écrasé après
 * sa première génération.
 */
@Component({
  selector: 'app-suppliers-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, CardModule, FieldErrorComponent, TranslatePipe],
  templateUrl: './suppliers-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SuppliersFormComponent {
  private readonly service = inject(SuppliersService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  /** Lié(s) automatiquement au(x) paramètre(s) de route (withComponentInputBinding). */
  readonly supplierid = input<string>();

  readonly isEdit = signal(false);
  readonly form = new FormGroup<Record<string, FormControl<any>>>({});

  constructor() {
    this.form.addControl('companyname', new FormControl<any>(null, [Validators.required, Validators.maxLength(40)]));
    this.form.addControl('contactname', new FormControl<any>(null, [Validators.maxLength(30)]));
    this.form.addControl('contacttitle', new FormControl<any>(null, [Validators.maxLength(30)]));
    this.form.addControl('address', new FormControl<any>(null, [Validators.maxLength(60)]));
    this.form.addControl('city', new FormControl<any>(null, [Validators.maxLength(15)]));
    this.form.addControl('region', new FormControl<any>(null, [Validators.maxLength(15)]));
    this.form.addControl('postalcode', new FormControl<any>(null, [Validators.maxLength(10)]));
    this.form.addControl('country', new FormControl<any>(null, [Validators.maxLength(15)]));
    this.form.addControl('phone', new FormControl<any>(null, [Validators.maxLength(24)]));
    this.form.addControl('fax', new FormControl<any>(null, [Validators.maxLength(24)]));
    this.form.addControl('homepage', new FormControl<any>(null));

    const supplieridValue = this.supplierid();

    if (supplieridValue) {
      this.isEdit.set(true);
      this.service.getById(supplieridValue as any)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(record => {
          const value: any = { ...record };
          this.form.patchValue(value);
        });
    }
  }

  onCancel(): void {
    this.router.navigate(['/exploitation', 'suppliers']);
  }

  onSave(): void {
    if (this.form.invalid) {
      // Rend visibles les messages des champs jamais touchés (voir FieldErrorComponent).
      this.form.markAllAsTouched();
      Object.keys(this.form.controls).forEach(name => this.form.get(name)?.markAsDirty());
      return;
    }
    // getRawValue() inclut les contrôles désactivés (colonnes de la clé en modification).
    const payload: any = { ...this.form.getRawValue() };

    const supplieridValue = this.supplierid();

    const request = this.isEdit()
      ? this.service.update(supplieridValue as any, payload as Suppliers)
      : this.service.create(payload as Suppliers);

    request
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.router.navigate(['/exploitation', 'suppliers']));
  }

}
