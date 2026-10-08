import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { finalize, firstValueFrom } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';

import { SuppliersService } from '../../core/services/suppliers.service';
import { AuthService } from '../../core/services/auth.service';
import { Suppliers } from '../../core/models/suppliers.model';

/**
 * Liste paginée côté serveur (p-table lazy : pagination, tri et recherche
 * globale passent par GET /api/suppliers/page).
 * Personnalisez librement ce composant.
 * Il n'est jamais écrasé après sa première génération.
 * L'ajout/la modification se font sur une page dédiée (voir suppliers-form.component).
 */
@Component({
  selector: 'app-suppliers-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    ConfirmDialogModule,
                TranslatePipe
  ],
  templateUrl: './suppliers-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SuppliersListComponent {

  private readonly service = inject(SuppliersService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly translate = inject(TranslateService);


  readonly items = signal<Suppliers[]>([]);
  readonly totalRecords = signal(0);
  readonly loading = signal(false);

  readonly canAdd = this.auth.hasPermission('POST', '/api/suppliers');
  readonly canEditRow = this.auth.hasPermission('PUT', '/api/suppliers/{supplierid}');
  readonly canDeleteRow = this.auth.hasPermission('DELETE', '/api/suppliers/{supplierid}');

  /** Mémorisés pour recharger la page courante (la p-table lazy émet l'événement initial elle-même). */
  private query = '';
  private lastEvent: TableLazyLoadEvent = { first: 0, rows: 15 };

  load(event: TableLazyLoadEvent): void {
    this.lastEvent = event;
    const size = event.rows ?? 15;
    const page = Math.floor((event.first ?? 0) / size);
    const sort = typeof event.sortField === 'string' ? event.sortField : undefined;
    const dir = event.sortOrder === -1 ? 'desc' : 'asc';
    this.loading.set(true);
    this.service.getPage(page, size, sort, dir, this.query || undefined)
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(res => {
        this.items.set(res.content);
        this.totalRecords.set(res.totalElements);
      });
  }

  onGlobalSearch(value: string, table: Table): void {
    this.query = value;
    table.first = 0;
    this.load({ ...this.lastEvent, first: 0 });
  }


  async exportExcel(): Promise<void> {
    // Exporte toutes les lignes (pas seulement la page affichée par la table lazy).
    const data = await firstValueFrom(this.service.getAll());
    const ExcelJS = await import('exceljs');
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Suppliers');

    sheet.columns = [
      { header: 'CompanyName', key: 'companyname', width: 20 },
      { header: 'ContactName', key: 'contactname', width: 20 },
      { header: 'ContactTitle', key: 'contacttitle', width: 20 },
      { header: 'Address', key: 'address', width: 20 },
      { header: 'City', key: 'city', width: 20 },
      { header: 'Region', key: 'region', width: 20 },
      { header: 'PostalCode', key: 'postalcode', width: 20 },
      { header: 'Country', key: 'country', width: 20 },
      { header: 'Phone', key: 'phone', width: 20 },
      { header: 'Fax', key: 'fax', width: 20 },
      { header: 'HomePage', key: 'homepage', width: 20 }
    ];
    sheet.getRow(1).font = { bold: true };

    sheet.addRows(data.map(item => ({
        companyname: item.companyname,
        contactname: item.contactname,
        contacttitle: item.contacttitle,
        address: item.address,
        city: item.city,
        region: item.region,
        postalcode: item.postalcode,
        country: item.country,
        phone: item.phone,
        fax: item.fax,
        homepage: item.homepage
    })));

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `suppliers_${new Date().toISOString().slice(0, 10)}.xlsx`;
    link.click();
    URL.revokeObjectURL(url);
  }

  openCreate(): void {
    this.router.navigate(['/exploitation', 'suppliers', 'nouveau']);
  }

  openEdit(item: Suppliers): void {
    this.router.navigate(['/exploitation', 'suppliers', item.supplierid, 'modifier']);
  }

  confirmDelete(item: Suppliers): void {
    this.confirmationService.confirm({
      message: this.translate.instant('table.confirmDeleteMessage'),
      header: this.translate.instant('table.confirmDeleteHeader'),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.service.delete(item.supplierid!)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            this.load(this.lastEvent);
            this.messageService.add({
              severity: 'success',
              summary: this.translate.instant('table.deletedSummary')
            });
          });
      }
    });
  }
}
