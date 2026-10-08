import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TranslatePipe } from '@ngx-translate/core';

export interface PermissionRow {
  endpointId: number;
  httpMethod: string;
  pathPattern: string;
  effect: 'ALLOW' | 'DENY' | null;
}

@Component({
  selector: 'app-permission-matrix',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    SelectButtonModule,
    TranslatePipe
  ],
  templateUrl: './permission-matrix.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PermissionMatrixComponent {

  readonly rows = input.required<PermissionRow[]>();

  readonly rowsChange = output<PermissionRow[]>();

  readonly effectOptions: { label: string; value: 'ALLOW' | 'DENY' | null }[] = [
    { label: 'admin.permissionMatrix.none', value: null },
    { label: 'admin.permissionMatrix.allow', value: 'ALLOW' },
    { label: 'admin.permissionMatrix.deny', value: 'DENY' }
  ];

  onChange(): void {
    // On fait une copie pour éviter les problèmes de readonly
    this.rowsChange.emit([...this.rows()]);
  }
}
