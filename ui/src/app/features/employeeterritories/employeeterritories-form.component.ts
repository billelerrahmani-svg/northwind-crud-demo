import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FieldErrorComponent } from '../../shared/validation/field-error.component';
import { finalize } from 'rxjs';
import { DialogModule } from 'primeng/dialog';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TranslatePipe } from '@ngx-translate/core';
import { Employees } from '../../core/models/employees.model';
import { EmployeesService } from '../../core/services/employees.service';
import { Territories } from '../../core/models/territories.model';
import { TerritoriesService } from '../../core/services/territories.service';

import { Employeeterritories } from '../../core/models/employeeterritories.model';
import { EmployeeterritoriesService } from '../../core/services/employeeterritories.service';

/**
 * Page dédiée d'ajout/modification (remplace le formulaire en dialog).
 * Personnalisez librement ce composant : il n'est jamais écrasé après
 * sa première génération.
 */
@Component({
  selector: 'app-employeeterritories-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, CardModule, FieldErrorComponent, DialogModule, TableModule, TranslatePipe],
  templateUrl: './employeeterritories-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeterritoriesFormComponent {
  private readonly service = inject(EmployeeterritoriesService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly employeesService = inject(EmployeesService);
  private readonly territoriesService = inject(TerritoriesService);

  /** Lié(s) automatiquement au(x) paramètre(s) de route (withComponentInputBinding). */
  readonly employeeid = input<string>();
  readonly territoryid = input<string>();

  readonly isEdit = signal(false);
  readonly form = new FormGroup<Record<string, FormControl<any>>>({});

  constructor() {
    this.form.addControl('employeeid', new FormControl<any>(null, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]));
    this.form.addControl('territoryid', new FormControl<any>(null, [Validators.required, Validators.maxLength(20)]));

    const employeeidValue = this.employeeid();
    const territoryidValue = this.territoryid();

    if (employeeidValue && territoryidValue) {
      this.isEdit.set(true);
      this.service.getById(employeeidValue as any, territoryidValue as any)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(record => {
          const value: any = { ...record };
          this.form.patchValue(value);
          if (record.employeeid != null) {
            this.loadEmployeeidLabel(record.employeeid);
          }
          if (record.territoryid != null) {
            this.loadTerritoryidLabel(record.territoryid);
          }
        });
      this.form.get('employeeid')?.disable();
      this.form.get('territoryid')?.disable();
    }
  }

  onCancel(): void {
    this.router.navigate(['/exploitation', 'employeeterritories']);
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

    const employeeidValue = this.employeeid();
    const territoryidValue = this.territoryid();

    const request = this.isEdit()
      ? this.service.update(employeeidValue as any, territoryidValue as any, payload as Employeeterritories)
      : this.service.create(payload as Employeeterritories);

    request
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.router.navigate(['/exploitation', 'employeeterritories']));
  }

  // --- Lookup Employeeid (FK vers Employees) ---

  readonly EmployeeidPickerVisible = signal(false);
  readonly EmployeeidPickerRows = signal<Employees[]>([]);
  readonly EmployeeidPickerTotal = signal(0);
  readonly EmployeeidPickerLoading = signal(false);
  readonly EmployeeidPickerQuery = signal('');
  readonly EmployeeidLabel = signal('');

  /** Texte affiché dans le champ : "clé - libellé" dès que le libellé est connu. */
  EmployeeidDisplay(): string {
    const value = this.form.get('employeeid')?.value;
    if (value === null || value === undefined || value === '') {
      return '';
    }
    const label = this.EmployeeidLabel();
    return label ? value + ' - ' + label : String(value);
  }

  openEmployeeidPicker(): void {
    this.EmployeeidPickerVisible.set(true);
  }

  onEmployeeidPickerLoad(event: TableLazyLoadEvent): void {
    const size = event.rows ?? 10;
    const page = Math.floor((event.first ?? 0) / size);
    this.EmployeeidPickerLoading.set(true);
    this.employeesService.getPage(page, size, undefined, undefined, this.EmployeeidPickerQuery() || undefined)
      .pipe(
        finalize(() => this.EmployeeidPickerLoading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(res => {
        this.EmployeeidPickerRows.set(res.content);
        this.EmployeeidPickerTotal.set(res.totalElements);
      });
  }

  onEmployeeidPickerSearch(value: string, table: Table): void {
    this.EmployeeidPickerQuery.set(value);
    table.first = 0;
    this.onEmployeeidPickerLoad({ first: 0, rows: table.rows ?? 10 });
  }

  selectEmployeeid(row: Employees): void {
    this.form.get('employeeid')?.setValue(row.employeeid);
    this.EmployeeidLabel.set(String(row.lastname ?? ''));
    this.EmployeeidPickerVisible.set(false);
  }

  clearEmployeeid(): void {
    this.form.get('employeeid')?.setValue(null);
    this.EmployeeidLabel.set('');
  }

  private loadEmployeeidLabel(id: any): void {
    this.employeesService.getById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(row => this.EmployeeidLabel.set(String(row.lastname ?? '')));
  }

  // --- Lookup Territoryid (FK vers Territories) ---

  readonly TerritoryidPickerVisible = signal(false);
  readonly TerritoryidPickerRows = signal<Territories[]>([]);
  readonly TerritoryidPickerTotal = signal(0);
  readonly TerritoryidPickerLoading = signal(false);
  readonly TerritoryidPickerQuery = signal('');
  readonly TerritoryidLabel = signal('');

  /** Texte affiché dans le champ : "clé - libellé" dès que le libellé est connu. */
  TerritoryidDisplay(): string {
    const value = this.form.get('territoryid')?.value;
    if (value === null || value === undefined || value === '') {
      return '';
    }
    const label = this.TerritoryidLabel();
    return label ? value + ' - ' + label : String(value);
  }

  openTerritoryidPicker(): void {
    this.TerritoryidPickerVisible.set(true);
  }

  onTerritoryidPickerLoad(event: TableLazyLoadEvent): void {
    const size = event.rows ?? 10;
    const page = Math.floor((event.first ?? 0) / size);
    this.TerritoryidPickerLoading.set(true);
    this.territoriesService.getPage(page, size, undefined, undefined, this.TerritoryidPickerQuery() || undefined)
      .pipe(
        finalize(() => this.TerritoryidPickerLoading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(res => {
        this.TerritoryidPickerRows.set(res.content);
        this.TerritoryidPickerTotal.set(res.totalElements);
      });
  }

  onTerritoryidPickerSearch(value: string, table: Table): void {
    this.TerritoryidPickerQuery.set(value);
    table.first = 0;
    this.onTerritoryidPickerLoad({ first: 0, rows: table.rows ?? 10 });
  }

  selectTerritoryid(row: Territories): void {
    this.form.get('territoryid')?.setValue(row.territoryid);
    this.TerritoryidLabel.set(String(row.territorydescription ?? ''));
    this.TerritoryidPickerVisible.set(false);
  }

  clearTerritoryid(): void {
    this.form.get('territoryid')?.setValue(null);
    this.TerritoryidLabel.set('');
  }

  private loadTerritoryidLabel(id: any): void {
    this.territoriesService.getById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(row => this.TerritoryidLabel.set(String(row.territorydescription ?? '')));
  }

}
