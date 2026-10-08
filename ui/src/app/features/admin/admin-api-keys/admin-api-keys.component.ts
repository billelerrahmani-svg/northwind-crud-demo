import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { ConfirmationService, MessageService } from 'primeng/api';

import { AdminApiKeyService } from '../../../core/services/admin-api-key.service';
import { AppApiKey } from '../../../core/models/api-key.model';
import { PermissionMatrixComponent, PermissionRow } from '../../../shared/permission-matrix/permission-matrix.component';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-admin-api-keys',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    CheckboxModule,
    ConfirmDialogModule,
    PermissionMatrixComponent,
    TranslatePipe
  ],
  templateUrl: './admin-api-keys.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminApiKeysComponent {

  private readonly service = inject(AdminApiKeyService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly translate = inject(TranslateService);

  readonly apiKeys = signal<AppApiKey[]>([]);
  readonly permissionRows = signal<PermissionRow[]>([]);

  readonly loading = signal(false);

  readonly formVisible = signal(false);
  readonly createdKeyVisible = signal(false);
  readonly permissionsVisible = signal(false);

  readonly createdRawKey = signal('');

  readonly selectedApiKeyId = signal<number | null>(null);

  readonly form = this.fb.group({
    ownerName: ['', Validators.required],
    description: '',
    enabled: true,
    expiresAt: null as string | null
  });

  constructor() {
    this.load();
  }

  load(): void {

    this.loading.set(true);

    this.service.getAll()
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(data => this.apiKeys.set(data));

  }

  openCreate(): void {

    this.form.reset({
      ownerName: '',
      description: '',
      enabled: true,
      expiresAt: null
    });

    this.formVisible.set(true);

  }

  onHideForm(): void {
    this.formVisible.set(false);
  }

  onSave(): void {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.service.create(this.form.getRawValue())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(created => {

        this.formVisible.set(false);

        this.createdRawKey.set(created.rawKey);
        this.createdKeyVisible.set(true);

        this.load();

      });

  }

  toggleEnabled(apiKey: AppApiKey): void {

    this.service.update(
      apiKey.id!,
      {
        ...apiKey,
        enabled: !apiKey.enabled
      }
    )
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(() => this.load());

  }

  confirmDelete(apiKey: AppApiKey): void {

    this.confirmationService.confirm({

      message: this.translate.instant('admin.apiKeys.confirmDelete', { ownerName: apiKey.ownerName }),
      header: this.translate.instant('common.confirmationHeader'),
      icon: 'pi pi-exclamation-triangle',

      accept: () => {

        this.service.delete(apiKey.id!)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {

            this.load();

            this.messageService.add({
              severity: 'success',
              summary: this.translate.instant('admin.apiKeys.revoked')
            });

          });

      }

    });

  }

  openPermissions(apiKey: AppApiKey): void {

    this.selectedApiKeyId.set(apiKey.id!);

    this.service.getPermissions(apiKey.id!)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(rows => {

        this.permissionRows.set(rows);
        this.permissionsVisible.set(true);

      });

  }

  onPermissionRowsChange(rows: PermissionRow[]): void {
    this.permissionRows.set(rows);
  }

  onSavePermissions(): void {

    this.service.setPermissions(
      this.selectedApiKeyId()!,
      this.permissionRows()
    )
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(() => {

      this.permissionsVisible.set(false);

      this.messageService.add({
        severity: 'success',
        summary: this.translate.instant('admin.apiKeys.permissionsUpdated')
      });

    });

  }

}
