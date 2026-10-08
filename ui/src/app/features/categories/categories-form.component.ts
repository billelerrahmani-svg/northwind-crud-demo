import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FieldErrorComponent } from '../../shared/validation/field-error.component';
import { TranslatePipe } from '@ngx-translate/core';

import { Categories } from '../../core/models/categories.model';
import { CategoriesService } from '../../core/services/categories.service';

/**
 * Page dédiée d'ajout/modification (remplace le formulaire en dialog).
 * Personnalisez librement ce composant : il n'est jamais écrasé après
 * sa première génération.
 */
@Component({
  selector: 'app-categories-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, CardModule, FieldErrorComponent, TranslatePipe],
  templateUrl: './categories-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoriesFormComponent implements OnInit {
  private readonly service = inject(CategoriesService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  /** Lié(s) automatiquement au(x) paramètre(s) de route (withComponentInputBinding). */
  readonly categoryid = input<string>();

  readonly isEdit = signal(false);
  readonly form = new FormGroup<Record<string, FormControl<any>>>({});

  constructor() {
    this.form.addControl('categoryname', new FormControl<any>(null, [Validators.required, Validators.maxLength(15)]));
    this.form.addControl('description', new FormControl<any>(null));
    this.form.addControl('picture', new FormControl<any>(null));
  }

  ngOnInit(): void {
    const categoryidValue = this.categoryid();

    if (categoryidValue) {
      this.isEdit.set(true);
      this.service.getById(categoryidValue as any)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(record => {
          const value: any = { ...record };
          this.form.patchValue(value);
        });
    }
  }

  onCancel(): void {
    this.router.navigate(['/exploitation', 'categories']);
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

    const categoryidValue = this.categoryid();

    const request = this.isEdit()
      ? this.service.update(categoryidValue as any, payload as Categories)
      : this.service.create(payload as Categories);

    request
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.router.navigate(['/exploitation', 'categories']));
  }

}
