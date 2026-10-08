import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize, firstValueFrom } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TranslatePipe } from '@ngx-translate/core';

import { CurrentProductListService } from '../../core/services/current-product-list.service';
import { CurrentProductList } from '../../core/models/current-product-list.model';

/**
 * Vue en base : liste en lecture seule (pas d'ajout/modification/suppression),
 * paginée côté serveur (p-table lazy : pagination, tri et recherche globale
 * passent par GET /api/current-product-list/page).
 * Personnalisez librement ce composant : il n'est jamais écrasé par une
 * régénération une fois créé (seul le modèle est régénéré).
 */
@Component({
  selector: 'app-current-product-list-list',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, InputTextModule, TranslatePipe],
  templateUrl: './current-product-list-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrentProductListListComponent {

  private readonly service = inject(CurrentProductListService);
  private readonly destroyRef = inject(DestroyRef);

  readonly items = signal<CurrentProductList[]>([]);
  readonly totalRecords = signal(0);
  readonly loading = signal(false);

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
    const sheet = workbook.addWorksheet('CurrentProductList');

    sheet.columns = [
      { header: 'ProductName', key: 'productname', width: 20 }
    ];
    sheet.getRow(1).font = { bold: true };

    sheet.addRows(data.map(item => ({
        productname: item.productname
    })));

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `current-product-list_${new Date().toISOString().slice(0, 10)}.xlsx`;
    link.click();
    URL.revokeObjectURL(url);
  }
}
