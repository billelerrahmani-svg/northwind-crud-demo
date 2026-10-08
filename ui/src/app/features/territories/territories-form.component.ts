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
import { finalize } from 'rxjs';
import { DialogModule } from 'primeng/dialog';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TranslatePipe } from '@ngx-translate/core';
import { Region } from '../../core/models/region.model';
import { RegionService } from '../../core/services/region.service';

import { Territories } from '../../core/models/territories.model';
import { TerritoriesService } from '../../core/services/territories.service';

/**
 * Page dédiée d'ajout/modification (remplace le formulaire en dialog).
 * Personnalisez librement ce composant : il n'est jamais écrasé après
 * sa première génération.
 */
@Component({
  selector: 'app-territories-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, CardModule, FieldErrorComponent, DialogModule, TableModule, TranslatePipe],
  templateUrl: './territories-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TerritoriesFormComponent {
  private readonly service = inject(TerritoriesService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly regionService = inject(RegionService);

  /** Lié(s) automatiquement au(x) paramètre(s) de route (withComponentInputBinding). */
  readonly territoryid = input<string>();

  readonly isEdit = signal(false);
  readonly form = new FormGroup<Record<string, FormControl<any>>>({});

  constructor() {
    this.form.addControl('territoryid', new FormControl<any>(null, [Validators.required, Validators.maxLength(20)]));
    this.form.addControl('territorydescription', new FormControl<any>(null, [Validators.required, exactLength(50)]));
    this.form.addControl('regionid', new FormControl<any>(null, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]));

    const territoryidValue = this.territoryid();

    if (territoryidValue) {
      this.isEdit.set(true);
      this.service.getById(territoryidValue as any)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(record => {
          const value: any = { ...record };
          this.form.patchValue(value);
          if (record.regionid != null) {
            this.loadRegionidLabel(record.regionid);
          }
        });
      this.form.get('territoryid')?.disable();
    }
  }

  onCancel(): void {
    this.router.navigate(['/exploitation', 'territories']);
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

    const territoryidValue = this.territoryid();

    const request = this.isEdit()
      ? this.service.update(territoryidValue as any, payload as Territories)
      : this.service.create(payload as Territories);

    request
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.router.navigate(['/exploitation', 'territories']));
  }

  // --- Lookup Regionid (FK vers Region) ---

  readonly RegionidPickerVisible = signal(false);
  readonly RegionidPickerRows = signal<Region[]>([]);
  readonly RegionidPickerTotal = signal(0);
  readonly RegionidPickerLoading = signal(false);
  readonly RegionidPickerQuery = signal('');
  readonly RegionidLabel = signal('');

  /** Texte affiché dans le champ : "clé - libellé" dès que le libellé est connu. */
  RegionidDisplay(): string {
    const value = this.form.get('regionid')?.value;
    if (value === null || value === undefined || value === '') {
      return '';
    }
    const label = this.RegionidLabel();
    return label ? value + ' - ' + label : String(value);
  }

  openRegionidPicker(): void {
    this.RegionidPickerVisible.set(true);
  }

  onRegionidPickerLoad(event: TableLazyLoadEvent): void {
    const size = event.rows ?? 10;
    const page = Math.floor((event.first ?? 0) / size);
    this.RegionidPickerLoading.set(true);
    this.regionService.getPage(page, size, undefined, undefined, this.RegionidPickerQuery() || undefined)
      .pipe(
        finalize(() => this.RegionidPickerLoading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(res => {
        this.RegionidPickerRows.set(res.content);
        this.RegionidPickerTotal.set(res.totalElements);
      });
  }

  onRegionidPickerSearch(value: string, table: Table): void {
    this.RegionidPickerQuery.set(value);
    table.first = 0;
    this.onRegionidPickerLoad({ first: 0, rows: table.rows ?? 10 });
  }

  selectRegionid(row: Region): void {
    this.form.get('regionid')?.setValue(row.regionid);
    this.RegionidLabel.set(String(row.regiondescription ?? ''));
    this.RegionidPickerVisible.set(false);
  }

  clearRegionid(): void {
    this.form.get('regionid')?.setValue(null);
    this.RegionidLabel.set('');
  }

  private loadRegionidLabel(id: any): void {
    this.regionService.getById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(row => this.RegionidLabel.set(String(row.regiondescription ?? '')));
  }

}
