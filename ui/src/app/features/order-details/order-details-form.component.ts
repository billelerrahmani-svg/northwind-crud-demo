import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FieldErrorComponent } from '../../shared/validation/field-error.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { finalize } from 'rxjs';
import { DialogModule } from 'primeng/dialog';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TranslatePipe } from '@ngx-translate/core';
import { Orders } from '../../core/models/orders.model';
import { OrdersService } from '../../core/services/orders.service';
import { Products } from '../../core/models/products.model';
import { ProductsService } from '../../core/services/products.service';

import { OrderDetails } from '../../core/models/order-details.model';
import { OrderDetailsService } from '../../core/services/order-details.service';

/**
 * Page dédiée d'ajout/modification (remplace le formulaire en dialog).
 * Personnalisez librement ce composant : il n'est jamais écrasé après
 * sa première génération.
 */
@Component({
  selector: 'app-order-details-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, CardModule, FieldErrorComponent, InputNumberModule, DialogModule, TableModule, TranslatePipe],
  templateUrl: './order-details-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderDetailsFormComponent {
  private readonly service = inject(OrderDetailsService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly ordersService = inject(OrdersService);
  private readonly productsService = inject(ProductsService);

  /** Lié(s) automatiquement au(x) paramètre(s) de route (withComponentInputBinding). */
  readonly orderid = input<string>();
  readonly productid = input<string>();

  readonly isEdit = signal(false);
  readonly form = new FormGroup<Record<string, FormControl<any>>>({});

  constructor() {
    this.form.addControl('orderid', new FormControl<any>(null, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]));
    this.form.addControl('productid', new FormControl<any>(null, [Validators.required, Validators.min(-2147483648), Validators.max(2147483647)]));
    this.form.addControl('unitprice', new FormControl<any>(null, [Validators.required]));
    this.form.addControl('quantity', new FormControl<any>(null, [Validators.required, Validators.min(-32768), Validators.max(32767)]));
    this.form.addControl('discount', new FormControl<any>(null, [Validators.required]));

    const orderidValue = this.orderid();
    const productidValue = this.productid();

    if (orderidValue && productidValue) {
      this.isEdit.set(true);
      this.service.getById(orderidValue as any, productidValue as any)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(record => {
          const value: any = { ...record };
          this.form.patchValue(value);
          if (record.orderid != null) {
            this.loadOrderidLabel(record.orderid);
          }
          if (record.productid != null) {
            this.loadProductidLabel(record.productid);
          }
        });
      this.form.get('orderid')?.disable();
      this.form.get('productid')?.disable();
    }
  }

  onCancel(): void {
    this.router.navigate(['/exploitation', 'order-details']);
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

    const orderidValue = this.orderid();
    const productidValue = this.productid();

    const request = this.isEdit()
      ? this.service.update(orderidValue as any, productidValue as any, payload as OrderDetails)
      : this.service.create(payload as OrderDetails);

    request
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.router.navigate(['/exploitation', 'order-details']));
  }

  // --- Lookup Orderid (FK vers Orders) ---

  readonly OrderidPickerVisible = signal(false);
  readonly OrderidPickerRows = signal<Orders[]>([]);
  readonly OrderidPickerTotal = signal(0);
  readonly OrderidPickerLoading = signal(false);
  readonly OrderidPickerQuery = signal('');
  readonly OrderidLabel = signal('');

  /** Texte affiché dans le champ : "clé - libellé" dès que le libellé est connu. */
  OrderidDisplay(): string {
    const value = this.form.get('orderid')?.value;
    if (value === null || value === undefined || value === '') {
      return '';
    }
    const label = this.OrderidLabel();
    return label ? value + ' - ' + label : String(value);
  }

  openOrderidPicker(): void {
    this.OrderidPickerVisible.set(true);
  }

  onOrderidPickerLoad(event: TableLazyLoadEvent): void {
    const size = event.rows ?? 10;
    const page = Math.floor((event.first ?? 0) / size);
    this.OrderidPickerLoading.set(true);
    this.ordersService.getPage(page, size, undefined, undefined, this.OrderidPickerQuery() || undefined)
      .pipe(
        finalize(() => this.OrderidPickerLoading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(res => {
        this.OrderidPickerRows.set(res.content);
        this.OrderidPickerTotal.set(res.totalElements);
      });
  }

  onOrderidPickerSearch(value: string, table: Table): void {
    this.OrderidPickerQuery.set(value);
    table.first = 0;
    this.onOrderidPickerLoad({ first: 0, rows: table.rows ?? 10 });
  }

  selectOrderid(row: Orders): void {
    this.form.get('orderid')?.setValue(row.orderid);
    this.OrderidLabel.set(String(row.customerid ?? ''));
    this.OrderidPickerVisible.set(false);
  }

  clearOrderid(): void {
    this.form.get('orderid')?.setValue(null);
    this.OrderidLabel.set('');
  }

  private loadOrderidLabel(id: any): void {
    this.ordersService.getById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(row => this.OrderidLabel.set(String(row.customerid ?? '')));
  }

  // --- Lookup Productid (FK vers Products) ---

  readonly ProductidPickerVisible = signal(false);
  readonly ProductidPickerRows = signal<Products[]>([]);
  readonly ProductidPickerTotal = signal(0);
  readonly ProductidPickerLoading = signal(false);
  readonly ProductidPickerQuery = signal('');
  readonly ProductidLabel = signal('');

  /** Texte affiché dans le champ : "clé - libellé" dès que le libellé est connu. */
  ProductidDisplay(): string {
    const value = this.form.get('productid')?.value;
    if (value === null || value === undefined || value === '') {
      return '';
    }
    const label = this.ProductidLabel();
    return label ? value + ' - ' + label : String(value);
  }

  openProductidPicker(): void {
    this.ProductidPickerVisible.set(true);
  }

  onProductidPickerLoad(event: TableLazyLoadEvent): void {
    const size = event.rows ?? 10;
    const page = Math.floor((event.first ?? 0) / size);
    this.ProductidPickerLoading.set(true);
    this.productsService.getPage(page, size, undefined, undefined, this.ProductidPickerQuery() || undefined)
      .pipe(
        finalize(() => this.ProductidPickerLoading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(res => {
        this.ProductidPickerRows.set(res.content);
        this.ProductidPickerTotal.set(res.totalElements);
      });
  }

  onProductidPickerSearch(value: string, table: Table): void {
    this.ProductidPickerQuery.set(value);
    table.first = 0;
    this.onProductidPickerLoad({ first: 0, rows: table.rows ?? 10 });
  }

  selectProductid(row: Products): void {
    this.form.get('productid')?.setValue(row.productid);
    this.ProductidLabel.set(String(row.productname ?? ''));
    this.ProductidPickerVisible.set(false);
  }

  clearProductid(): void {
    this.form.get('productid')?.setValue(null);
    this.ProductidLabel.set('');
  }

  private loadProductidLabel(id: any): void {
    this.productsService.getById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(row => this.ProductidLabel.set(String(row.productname ?? '')));
  }

}
