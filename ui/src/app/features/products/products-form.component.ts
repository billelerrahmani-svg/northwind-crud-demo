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
import { CheckboxModule } from 'primeng/checkbox';
import { finalize } from 'rxjs';
import { DialogModule } from 'primeng/dialog';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TranslatePipe } from '@ngx-translate/core';
import { Suppliers } from '../../core/models/suppliers.model';
import { SuppliersService } from '../../core/services/suppliers.service';
import { Categories } from '../../core/models/categories.model';
import { CategoriesService } from '../../core/services/categories.service';

import { Products } from '../../core/models/products.model';
import { ProductsService } from '../../core/services/products.service';

/**
 * Page dédiée d'ajout/modification (remplace le formulaire en dialog).
 * Personnalisez librement ce composant : il n'est jamais écrasé après
 * sa première génération.
 */
@Component({
  selector: 'app-products-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, CardModule, FieldErrorComponent, InputNumberModule, CheckboxModule, DialogModule, TableModule, TranslatePipe],
  templateUrl: './products-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsFormComponent {
  private readonly service = inject(ProductsService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly suppliersService = inject(SuppliersService);
  private readonly categoriesService = inject(CategoriesService);

  /** Lié(s) automatiquement au(x) paramètre(s) de route (withComponentInputBinding). */
  readonly productid = input<string>();

  readonly isEdit = signal(false);
  readonly form = new FormGroup<Record<string, FormControl<any>>>({});

  constructor() {
    this.form.addControl('productname', new FormControl<any>(null, [Validators.required, Validators.maxLength(40)]));
    this.form.addControl('supplierid', new FormControl<any>(null, [Validators.min(-2147483648), Validators.max(2147483647)]));
    this.form.addControl('categoryid', new FormControl<any>(null, [Validators.min(-2147483648), Validators.max(2147483647)]));
    this.form.addControl('quantityperunit', new FormControl<any>(null, [Validators.maxLength(20)]));
    this.form.addControl('unitprice', new FormControl<any>(null));
    this.form.addControl('unitsinstock', new FormControl<any>(null, [Validators.min(-32768), Validators.max(32767)]));
    this.form.addControl('unitsonorder', new FormControl<any>(null, [Validators.min(-32768), Validators.max(32767)]));
    this.form.addControl('reorderlevel', new FormControl<any>(null, [Validators.min(-32768), Validators.max(32767)]));
    this.form.addControl('discontinued', new FormControl<any>(false));

    const productidValue = this.productid();

    if (productidValue) {
      this.isEdit.set(true);
      this.service.getById(productidValue as any)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(record => {
          const value: any = { ...record };
          this.form.patchValue(value);
          if (record.supplierid != null) {
            this.loadSupplieridLabel(record.supplierid);
          }
          if (record.categoryid != null) {
            this.loadCategoryidLabel(record.categoryid);
          }
        });
    }
  }

  onCancel(): void {
    this.router.navigate(['/exploitation', 'products']);
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

    const productidValue = this.productid();

    const request = this.isEdit()
      ? this.service.update(productidValue as any, payload as Products)
      : this.service.create(payload as Products);

    request
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.router.navigate(['/exploitation', 'products']));
  }

  // --- Lookup Supplierid (FK vers Suppliers) ---

  readonly SupplieridPickerVisible = signal(false);
  readonly SupplieridPickerRows = signal<Suppliers[]>([]);
  readonly SupplieridPickerTotal = signal(0);
  readonly SupplieridPickerLoading = signal(false);
  readonly SupplieridPickerQuery = signal('');
  readonly SupplieridLabel = signal('');

  /** Texte affiché dans le champ : "clé - libellé" dès que le libellé est connu. */
  SupplieridDisplay(): string {
    const value = this.form.get('supplierid')?.value;
    if (value === null || value === undefined || value === '') {
      return '';
    }
    const label = this.SupplieridLabel();
    return label ? value + ' - ' + label : String(value);
  }

  openSupplieridPicker(): void {
    this.SupplieridPickerVisible.set(true);
  }

  onSupplieridPickerLoad(event: TableLazyLoadEvent): void {
    const size = event.rows ?? 10;
    const page = Math.floor((event.first ?? 0) / size);
    this.SupplieridPickerLoading.set(true);
    this.suppliersService.getPage(page, size, undefined, undefined, this.SupplieridPickerQuery() || undefined)
      .pipe(
        finalize(() => this.SupplieridPickerLoading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(res => {
        this.SupplieridPickerRows.set(res.content);
        this.SupplieridPickerTotal.set(res.totalElements);
      });
  }

  onSupplieridPickerSearch(value: string, table: Table): void {
    this.SupplieridPickerQuery.set(value);
    table.first = 0;
    this.onSupplieridPickerLoad({ first: 0, rows: table.rows ?? 10 });
  }

  selectSupplierid(row: Suppliers): void {
    this.form.get('supplierid')?.setValue(row.supplierid);
    this.SupplieridLabel.set(String(row.companyname ?? ''));
    this.SupplieridPickerVisible.set(false);
  }

  clearSupplierid(): void {
    this.form.get('supplierid')?.setValue(null);
    this.SupplieridLabel.set('');
  }

  private loadSupplieridLabel(id: any): void {
    this.suppliersService.getById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(row => this.SupplieridLabel.set(String(row.companyname ?? '')));
  }

  // --- Lookup Categoryid (FK vers Categories) ---

  readonly CategoryidPickerVisible = signal(false);
  readonly CategoryidPickerRows = signal<Categories[]>([]);
  readonly CategoryidPickerTotal = signal(0);
  readonly CategoryidPickerLoading = signal(false);
  readonly CategoryidPickerQuery = signal('');
  readonly CategoryidLabel = signal('');

  /** Texte affiché dans le champ : "clé - libellé" dès que le libellé est connu. */
  CategoryidDisplay(): string {
    const value = this.form.get('categoryid')?.value;
    if (value === null || value === undefined || value === '') {
      return '';
    }
    const label = this.CategoryidLabel();
    return label ? value + ' - ' + label : String(value);
  }

  openCategoryidPicker(): void {
    this.CategoryidPickerVisible.set(true);
  }

  onCategoryidPickerLoad(event: TableLazyLoadEvent): void {
    const size = event.rows ?? 10;
    const page = Math.floor((event.first ?? 0) / size);
    this.CategoryidPickerLoading.set(true);
    this.categoriesService.getPage(page, size, undefined, undefined, this.CategoryidPickerQuery() || undefined)
      .pipe(
        finalize(() => this.CategoryidPickerLoading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(res => {
        this.CategoryidPickerRows.set(res.content);
        this.CategoryidPickerTotal.set(res.totalElements);
      });
  }

  onCategoryidPickerSearch(value: string, table: Table): void {
    this.CategoryidPickerQuery.set(value);
    table.first = 0;
    this.onCategoryidPickerLoad({ first: 0, rows: table.rows ?? 10 });
  }

  selectCategoryid(row: Categories): void {
    this.form.get('categoryid')?.setValue(row.categoryid);
    this.CategoryidLabel.set(String(row.categoryname ?? ''));
    this.CategoryidPickerVisible.set(false);
  }

  clearCategoryid(): void {
    this.form.get('categoryid')?.setValue(null);
    this.CategoryidLabel.set('');
  }

  private loadCategoryidLabel(id: any): void {
    this.categoriesService.getById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(row => this.CategoryidLabel.set(String(row.categoryname ?? '')));
  }

}
