import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
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
import { DatePickerModule } from 'primeng/datepicker';
import { finalize } from 'rxjs';
import { DialogModule } from 'primeng/dialog';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TranslatePipe } from '@ngx-translate/core';
import { Customers } from '../../core/models/customers.model';
import { CustomersService } from '../../core/services/customers.service';
import { Employees } from '../../core/models/employees.model';
import { EmployeesService } from '../../core/services/employees.service';
import { Shippers } from '../../core/models/shippers.model';
import { ShippersService } from '../../core/services/shippers.service';

import { Orders } from '../../core/models/orders.model';
import { OrdersService } from '../../core/services/orders.service';

/**
 * Page dédiée d'ajout/modification (remplace le formulaire en dialog).
 * Personnalisez librement ce composant : il n'est jamais écrasé après
 * sa première génération.
 */
@Component({
  selector: 'app-orders-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, CardModule, FieldErrorComponent, InputNumberModule, DatePickerModule, DialogModule, TableModule, TranslatePipe],
  templateUrl: './orders-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrdersFormComponent implements OnInit {
  private readonly service = inject(OrdersService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly customersService = inject(CustomersService);
  private readonly employeesService = inject(EmployeesService);
  private readonly shippersService = inject(ShippersService);

  /** Lié(s) automatiquement au(x) paramètre(s) de route (withComponentInputBinding). */
  readonly orderid = input<string>();

  readonly isEdit = signal(false);
  readonly form = new FormGroup<Record<string, FormControl<any>>>({});

  /** Plage acceptée par la colonne OrderDate en base. */
  readonly orderdateMinDate = new Date(1753, 0, 1);
  readonly orderdateMaxDate = new Date(9999, 11, 31);

  /** Plage acceptée par la colonne RequiredDate en base. */
  readonly requireddateMinDate = new Date(1753, 0, 1);
  readonly requireddateMaxDate = new Date(9999, 11, 31);

  /** Plage acceptée par la colonne ShippedDate en base. */
  readonly shippeddateMinDate = new Date(1753, 0, 1);
  readonly shippeddateMaxDate = new Date(9999, 11, 31);

  constructor() {
    this.form.addControl('customerid', new FormControl<any>(null, [exactLength(5)]));
    this.form.addControl('employeeid', new FormControl<any>(null, [Validators.min(-2147483648), Validators.max(2147483647)]));
    this.form.addControl('orderdate', new FormControl<any>(null));
    this.form.addControl('requireddate', new FormControl<any>(null));
    this.form.addControl('shippeddate', new FormControl<any>(null));
    this.form.addControl('shipvia', new FormControl<any>(null, [Validators.min(-2147483648), Validators.max(2147483647)]));
    this.form.addControl('freight', new FormControl<any>(null));
    this.form.addControl('shipname', new FormControl<any>(null, [Validators.maxLength(40)]));
    this.form.addControl('shipaddress', new FormControl<any>(null, [Validators.maxLength(60)]));
    this.form.addControl('shipcity', new FormControl<any>(null, [Validators.maxLength(15)]));
    this.form.addControl('shipregion', new FormControl<any>(null, [Validators.maxLength(15)]));
    this.form.addControl('shippostalcode', new FormControl<any>(null, [Validators.maxLength(10)]));
    this.form.addControl('shipcountry', new FormControl<any>(null, [Validators.maxLength(15)]));
  }

  ngOnInit(): void {
    const orderidValue = this.orderid();

    if (orderidValue) {
      this.isEdit.set(true);
      this.service.getById(orderidValue as any)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(record => {
          const value: any = { ...record };
          if (value.orderdate) value.orderdate = new Date(value.orderdate);
          if (value.requireddate) value.requireddate = new Date(value.requireddate);
          if (value.shippeddate) value.shippeddate = new Date(value.shippeddate);
          this.form.patchValue(value);
          if (record.customerid != null) {
            this.loadCustomeridLabel(record.customerid);
          }
          if (record.employeeid != null) {
            this.loadEmployeeidLabel(record.employeeid);
          }
          if (record.shipvia != null) {
            this.loadShipviaLabel(record.shipvia);
          }
        });
    }
  }

  onCancel(): void {
    this.router.navigate(['/exploitation', 'orders']);
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
    if (payload.orderdate instanceof Date) payload.orderdate = this.formatDateTime(payload.orderdate);
    if (payload.requireddate instanceof Date) payload.requireddate = this.formatDateTime(payload.requireddate);
    if (payload.shippeddate instanceof Date) payload.shippeddate = this.formatDateTime(payload.shippeddate);

    const orderidValue = this.orderid();

    const request = this.isEdit()
      ? this.service.update(orderidValue as any, payload as Orders)
      : this.service.create(payload as Orders);

    request
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.router.navigate(['/exploitation', 'orders']));
  }

  // --- Lookup Customerid (FK vers Customers) ---

  readonly CustomeridPickerVisible = signal(false);
  readonly CustomeridPickerRows = signal<Customers[]>([]);
  readonly CustomeridPickerTotal = signal(0);
  readonly CustomeridPickerLoading = signal(false);
  readonly CustomeridPickerQuery = signal('');
  readonly CustomeridLabel = signal('');

  /** Texte affiché dans le champ : "clé - libellé" dès que le libellé est connu. */
  CustomeridDisplay(): string {
    const value = this.form.get('customerid')?.value;
    if (value === null || value === undefined || value === '') {
      return '';
    }
    const label = this.CustomeridLabel();
    return label ? value + ' - ' + label : String(value);
  }

  openCustomeridPicker(): void {
    this.CustomeridPickerVisible.set(true);
  }

  onCustomeridPickerLoad(event: TableLazyLoadEvent): void {
    const size = event.rows ?? 10;
    const page = Math.floor((event.first ?? 0) / size);
    this.CustomeridPickerLoading.set(true);
    this.customersService.getPage(page, size, undefined, undefined, this.CustomeridPickerQuery() || undefined)
      .pipe(
        finalize(() => this.CustomeridPickerLoading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(res => {
        this.CustomeridPickerRows.set(res.content);
        this.CustomeridPickerTotal.set(res.totalElements);
      });
  }

  onCustomeridPickerSearch(value: string, table: Table): void {
    this.CustomeridPickerQuery.set(value);
    table.first = 0;
    this.onCustomeridPickerLoad({ first: 0, rows: table.rows ?? 10 });
  }

  selectCustomerid(row: Customers): void {
    this.form.get('customerid')?.setValue(row.customerid);
    this.CustomeridLabel.set(String(row.companyname ?? ''));
    this.CustomeridPickerVisible.set(false);
  }

  clearCustomerid(): void {
    this.form.get('customerid')?.setValue(null);
    this.CustomeridLabel.set('');
  }

  private loadCustomeridLabel(id: any): void {
    this.customersService.getById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(row => this.CustomeridLabel.set(String(row.companyname ?? '')));
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

  // --- Lookup Shipvia (FK vers Shippers) ---

  readonly ShipviaPickerVisible = signal(false);
  readonly ShipviaPickerRows = signal<Shippers[]>([]);
  readonly ShipviaPickerTotal = signal(0);
  readonly ShipviaPickerLoading = signal(false);
  readonly ShipviaPickerQuery = signal('');
  readonly ShipviaLabel = signal('');

  /** Texte affiché dans le champ : "clé - libellé" dès que le libellé est connu. */
  ShipviaDisplay(): string {
    const value = this.form.get('shipvia')?.value;
    if (value === null || value === undefined || value === '') {
      return '';
    }
    const label = this.ShipviaLabel();
    return label ? value + ' - ' + label : String(value);
  }

  openShipviaPicker(): void {
    this.ShipviaPickerVisible.set(true);
  }

  onShipviaPickerLoad(event: TableLazyLoadEvent): void {
    const size = event.rows ?? 10;
    const page = Math.floor((event.first ?? 0) / size);
    this.ShipviaPickerLoading.set(true);
    this.shippersService.getPage(page, size, undefined, undefined, this.ShipviaPickerQuery() || undefined)
      .pipe(
        finalize(() => this.ShipviaPickerLoading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(res => {
        this.ShipviaPickerRows.set(res.content);
        this.ShipviaPickerTotal.set(res.totalElements);
      });
  }

  onShipviaPickerSearch(value: string, table: Table): void {
    this.ShipviaPickerQuery.set(value);
    table.first = 0;
    this.onShipviaPickerLoad({ first: 0, rows: table.rows ?? 10 });
  }

  selectShipvia(row: Shippers): void {
    this.form.get('shipvia')?.setValue(row.shipperid);
    this.ShipviaLabel.set(String(row.companyname ?? ''));
    this.ShipviaPickerVisible.set(false);
  }

  clearShipvia(): void {
    this.form.get('shipvia')?.setValue(null);
    this.ShipviaLabel.set('');
  }

  private loadShipviaLabel(id: any): void {
    this.shippersService.getById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(row => this.ShipviaLabel.set(String(row.companyname ?? '')));
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
