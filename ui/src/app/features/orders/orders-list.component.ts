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

import { OrdersService } from '../../core/services/orders.service';
import { AuthService } from '../../core/services/auth.service';
import { Orders } from '../../core/models/orders.model';

/**
 * Liste paginée côté serveur (p-table lazy : pagination, tri et recherche
 * globale passent par GET /api/orders/page).
 * Personnalisez librement ce composant.
 * Il n'est jamais écrasé après sa première génération.
 * L'ajout/la modification se font sur une page dédiée (voir orders-form.component).
 */
@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    ConfirmDialogModule,
                TranslatePipe
  ],
  templateUrl: './orders-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrdersListComponent {

  private readonly service = inject(OrdersService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly translate = inject(TranslateService);


  readonly items = signal<Orders[]>([]);
  readonly totalRecords = signal(0);
  readonly loading = signal(false);

  readonly canAdd = this.auth.hasPermission('POST', '/api/orders');
  readonly canEditRow = this.auth.hasPermission('PUT', '/api/orders/{orderid}');
  readonly canDeleteRow = this.auth.hasPermission('DELETE', '/api/orders/{orderid}');

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
    const sheet = workbook.addWorksheet('Orders');

    sheet.columns = [
      { header: 'CustomerID', key: 'customerid', width: 20 },
      { header: 'EmployeeID', key: 'employeeid', width: 20, style: { numFmt: '#,##0.00' } },
      { header: 'OrderDate', key: 'orderdate', width: 20, style: { numFmt: 'dd/mm/yyyy hh:mm' } },
      { header: 'RequiredDate', key: 'requireddate', width: 20, style: { numFmt: 'dd/mm/yyyy hh:mm' } },
      { header: 'ShippedDate', key: 'shippeddate', width: 20, style: { numFmt: 'dd/mm/yyyy hh:mm' } },
      { header: 'ShipVia', key: 'shipvia', width: 20, style: { numFmt: '#,##0.00' } },
      { header: 'Freight', key: 'freight', width: 20, style: { numFmt: '#,##0.00' } },
      { header: 'ShipName', key: 'shipname', width: 20 },
      { header: 'ShipAddress', key: 'shipaddress', width: 20 },
      { header: 'ShipCity', key: 'shipcity', width: 20 },
      { header: 'ShipRegion', key: 'shipregion', width: 20 },
      { header: 'ShipPostalCode', key: 'shippostalcode', width: 20 },
      { header: 'ShipCountry', key: 'shipcountry', width: 20 }
    ];
    sheet.getRow(1).font = { bold: true };

    sheet.addRows(data.map(item => ({
        customerid: item.customerid,
        employeeid: item.employeeid,
        orderdate: item.orderdate ? new Date(item.orderdate) : null,
        requireddate: item.requireddate ? new Date(item.requireddate) : null,
        shippeddate: item.shippeddate ? new Date(item.shippeddate) : null,
        shipvia: item.shipvia,
        freight: item.freight,
        shipname: item.shipname,
        shipaddress: item.shipaddress,
        shipcity: item.shipcity,
        shipregion: item.shipregion,
        shippostalcode: item.shippostalcode,
        shipcountry: item.shipcountry
    })));

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `orders_${new Date().toISOString().slice(0, 10)}.xlsx`;
    link.click();
    URL.revokeObjectURL(url);
  }

  openCreate(): void {
    this.router.navigate(['/exploitation', 'orders', 'nouveau']);
  }

  openEdit(item: Orders): void {
    this.router.navigate(['/exploitation', 'orders', item.orderid, 'modifier']);
  }

  confirmDelete(item: Orders): void {
    this.confirmationService.confirm({
      message: this.translate.instant('table.confirmDeleteMessage'),
      header: this.translate.instant('table.confirmDeleteHeader'),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.service.delete(item.orderid!)
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
