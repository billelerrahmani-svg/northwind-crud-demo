import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FieldErrorComponent } from '../../shared/validation/field-error.component';
import { exactLength } from '../../shared/validation/validators';
import { TranslatePipe } from '@ngx-translate/core';

import { Customers } from '../../core/models/customers.model';
import { CustomersService } from '../../core/services/customers.service';

/**
 * Page dédiée d'ajout/modification (remplace le formulaire en dialog).
 * Personnalisez librement ce composant : il n'est jamais écrasé après
 * sa première génération.
 */
@Component({
  selector: 'app-customers-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, CardModule, FieldErrorComponent, TranslatePipe],
  templateUrl: './customers-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomersFormComponent {
  private readonly service = inject(CustomersService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  /** Lié(s) automatiquement au(x) paramètre(s) de route (withComponentInputBinding). */
  readonly customerid = input<string>();

  readonly isEdit = signal(false);
  readonly form = new FormGroup<Record<string, FormControl<any>>>({});

  constructor() {
    this.form.addControl('customerid', new FormControl<any>(null, [Validators.required, exactLength(5)]));
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

    const customeridValue = this.customerid();

    if (customeridValue) {
      this.isEdit.set(true);
      this.service.getById(customeridValue as any)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(record => {
          const value: any = { ...record };
          this.form.patchValue(value);
        });
      this.form.get('customerid')?.disable();
    }
  }

  onCancel(): void {
    this.router.navigate(['/exploitation', 'customers']);
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

    const customeridValue = this.customerid();

    const request = this.isEdit()
      ? this.service.update(customeridValue as any, payload as Customers)
      : this.service.create(payload as Customers);

    request
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.router.navigate(['/exploitation', 'customers']));
  }

}
