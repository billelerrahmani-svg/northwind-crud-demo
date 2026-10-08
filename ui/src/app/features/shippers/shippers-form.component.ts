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

import { Shippers } from '../../core/models/shippers.model';
import { ShippersService } from '../../core/services/shippers.service';

/**
 * Page dédiée d'ajout/modification (remplace le formulaire en dialog).
 * Personnalisez librement ce composant : il n'est jamais écrasé après
 * sa première génération.
 */
@Component({
  selector: 'app-shippers-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, CardModule, FieldErrorComponent, TranslatePipe],
  templateUrl: './shippers-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShippersFormComponent {
  private readonly service = inject(ShippersService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  /** Lié(s) automatiquement au(x) paramètre(s) de route (withComponentInputBinding). */
  readonly shipperid = input<string>();

  readonly isEdit = signal(false);
  readonly form = new FormGroup<Record<string, FormControl<any>>>({});

  constructor() {
    this.form.addControl('companyname', new FormControl<any>(null, [Validators.required, Validators.maxLength(40)]));
    this.form.addControl('phone', new FormControl<any>(null, [Validators.maxLength(24)]));

    const shipperidValue = this.shipperid();

    if (shipperidValue) {
      this.isEdit.set(true);
      this.service.getById(shipperidValue as any)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(record => {
          const value: any = { ...record };
          this.form.patchValue(value);
        });
    }
  }

  onCancel(): void {
    this.router.navigate(['/exploitation', 'shippers']);
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

    const shipperidValue = this.shipperid();

    const request = this.isEdit()
      ? this.service.update(shipperidValue as any, payload as Shippers)
      : this.service.create(payload as Shippers);

    request
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.router.navigate(['/exploitation', 'shippers']));
  }

}
