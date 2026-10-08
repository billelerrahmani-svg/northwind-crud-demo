import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FieldErrorComponent } from '../../shared/validation/field-error.component';
import { DatePickerModule } from 'primeng/datepicker';
import { finalize } from 'rxjs';
import { DialogModule } from 'primeng/dialog';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TranslatePipe } from '@ngx-translate/core';

import { Employees } from '../../core/models/employees.model';
import { EmployeesService } from '../../core/services/employees.service';

/**
 * Page dédiée d'ajout/modification (remplace le formulaire en dialog).
 * Personnalisez librement ce composant : il n'est jamais écrasé après
 * sa première génération.
 */
@Component({
  selector: 'app-employees-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, CardModule, FieldErrorComponent, DatePickerModule, DialogModule, TableModule, TranslatePipe],
  templateUrl: './employees-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeesFormComponent implements OnInit {
  private readonly service = inject(EmployeesService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  /** Lié(s) automatiquement au(x) paramètre(s) de route (withComponentInputBinding). */
  readonly employeeid = input<string>();

  readonly isEdit = signal(false);
  readonly form = new FormGroup<Record<string, FormControl<any>>>({});

  /** Plage acceptée par la colonne BirthDate en base. */
  readonly birthdateMinDate = new Date(1753, 0, 1);
  readonly birthdateMaxDate = new Date(9999, 11, 31);

  /** Plage acceptée par la colonne HireDate en base. */
  readonly hiredateMinDate = new Date(1753, 0, 1);
  readonly hiredateMaxDate = new Date(9999, 11, 31);

  constructor() {
    this.form.addControl('lastname', new FormControl<any>(null, [Validators.required, Validators.maxLength(20)]));
    this.form.addControl('firstname', new FormControl<any>(null, [Validators.required, Validators.maxLength(10)]));
    this.form.addControl('title', new FormControl<any>(null, [Validators.maxLength(30)]));
    this.form.addControl('titleofcourtesy', new FormControl<any>(null, [Validators.maxLength(25)]));
    this.form.addControl('birthdate', new FormControl<any>(null));
    this.form.addControl('hiredate', new FormControl<any>(null));
    this.form.addControl('address', new FormControl<any>(null, [Validators.maxLength(60)]));
    this.form.addControl('city', new FormControl<any>(null, [Validators.maxLength(15)]));
    this.form.addControl('region', new FormControl<any>(null, [Validators.maxLength(15)]));
    this.form.addControl('postalcode', new FormControl<any>(null, [Validators.maxLength(10)]));
    this.form.addControl('country', new FormControl<any>(null, [Validators.maxLength(15)]));
    this.form.addControl('homephone', new FormControl<any>(null, [Validators.maxLength(24)]));
    this.form.addControl('extension', new FormControl<any>(null, [Validators.maxLength(4)]));
    this.form.addControl('photo', new FormControl<any>(null));
    this.form.addControl('notes', new FormControl<any>(null));
    this.form.addControl('reportsto', new FormControl<any>(null, [Validators.min(-2147483648), Validators.max(2147483647)]));
    this.form.addControl('photopath', new FormControl<any>(null, [Validators.maxLength(255)]));
  }

  ngOnInit(): void {
    const employeeidValue = this.employeeid();

    if (employeeidValue) {
      this.isEdit.set(true);
      this.service.getById(employeeidValue as any)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(record => {
          const value: any = { ...record };
          if (value.birthdate) value.birthdate = new Date(value.birthdate);
          if (value.hiredate) value.hiredate = new Date(value.hiredate);
          this.form.patchValue(value);
          if (record.reportsto != null) {
            this.loadReportstoLabel(record.reportsto);
          }
        });
    }
  }

  onCancel(): void {
    this.router.navigate(['/exploitation', 'employees']);
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
    if (payload.birthdate instanceof Date) payload.birthdate = this.formatDateTime(payload.birthdate);
    if (payload.hiredate instanceof Date) payload.hiredate = this.formatDateTime(payload.hiredate);

    const employeeidValue = this.employeeid();

    const request = this.isEdit()
      ? this.service.update(employeeidValue as any, payload as Employees)
      : this.service.create(payload as Employees);

    request
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.router.navigate(['/exploitation', 'employees']));
  }

  // --- Lookup Reportsto (FK vers Employees) ---

  readonly ReportstoPickerVisible = signal(false);
  readonly ReportstoPickerRows = signal<Employees[]>([]);
  readonly ReportstoPickerTotal = signal(0);
  readonly ReportstoPickerLoading = signal(false);
  readonly ReportstoPickerQuery = signal('');
  readonly ReportstoLabel = signal('');

  /** Texte affiché dans le champ : "clé - libellé" dès que le libellé est connu. */
  ReportstoDisplay(): string {
    const value = this.form.get('reportsto')?.value;
    if (value === null || value === undefined || value === '') {
      return '';
    }
    const label = this.ReportstoLabel();
    return label ? value + ' - ' + label : String(value);
  }

  openReportstoPicker(): void {
    this.ReportstoPickerVisible.set(true);
  }

  onReportstoPickerLoad(event: TableLazyLoadEvent): void {
    const size = event.rows ?? 10;
    const page = Math.floor((event.first ?? 0) / size);
    this.ReportstoPickerLoading.set(true);
    this.service.getPage(page, size, undefined, undefined, this.ReportstoPickerQuery() || undefined)
      .pipe(
        finalize(() => this.ReportstoPickerLoading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(res => {
        this.ReportstoPickerRows.set(res.content);
        this.ReportstoPickerTotal.set(res.totalElements);
      });
  }

  onReportstoPickerSearch(value: string, table: Table): void {
    this.ReportstoPickerQuery.set(value);
    table.first = 0;
    this.onReportstoPickerLoad({ first: 0, rows: table.rows ?? 10 });
  }

  selectReportsto(row: Employees): void {
    this.form.get('reportsto')?.setValue(row.employeeid);
    this.ReportstoLabel.set(String(row.lastname ?? ''));
    this.ReportstoPickerVisible.set(false);
  }

  clearReportsto(): void {
    this.form.get('reportsto')?.setValue(null);
    this.ReportstoLabel.set('');
  }

  private loadReportstoLabel(id: any): void {
    this.service.getById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(row => this.ReportstoLabel.set(String(row.lastname ?? '')));
  }


  private formatDate(date: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  }

  private formatDateTime(date: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${this.formatDate(date)}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }
}
