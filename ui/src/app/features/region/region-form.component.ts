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
import { InputNumberModule } from 'primeng/inputnumber';
import { TranslatePipe } from '@ngx-translate/core';

import { Region } from '../../core/models/region.model';
import { RegionService } from '../../core/services/region.service';

/**
 * Page dédiée d'ajout/modification (remplace le formulaire en dialog).
 * Personnalisez librement ce composant : il n'est jamais écrasé après
 * sa première génération.
 */
@Component({
  selector: 'app-region-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, CardModule, FieldErrorComponent, InputNumberModule, TranslatePipe],
  templateUrl: './region-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegionFormComponent {
  private readonly service = inject(RegionService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  /** Lié(s) automatiquement au(x) paramètre(s) de route (withComponentInputBinding). */
  readonly regionid = input<string>();

  readonly isEdit = signal(false);
  readonly form = new FormGroup<Record<string, FormControl<any>>>({});

  constructor() {
    this.form.addControl('regionid', new FormControl<any>(null, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]));
    this.form.addControl('regiondescription', new FormControl<any>(null, [Validators.required, exactLength(50)]));

    const regionidValue = this.regionid();

    if (regionidValue) {
      this.isEdit.set(true);
      this.service.getById(regionidValue as any)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(record => {
          const value: any = { ...record };
          this.form.patchValue(value);
        });
      this.form.get('regionid')?.disable();
    }
  }

  onCancel(): void {
    this.router.navigate(['/exploitation', 'region']);
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

    const regionidValue = this.regionid();

    const request = this.isEdit()
      ? this.service.update(regionidValue as any, payload as Region)
      : this.service.create(payload as Region);

    request
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.router.navigate(['/exploitation', 'region']));
  }

}
