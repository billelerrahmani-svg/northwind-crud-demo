import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { ConfirmationService, MessageService } from 'primeng/api';

import { AdminRoleService } from '../../../core/services/admin-role.service';
import { AppRole } from '../../../core/models/role.model';
import { PermissionMatrixComponent, PermissionRow } from '../../../shared/permission-matrix/permission-matrix.component';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';

const BUILT_IN_ROLES = ['001', '002', '003'];

@Component({
  selector: 'app-admin-roles',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    ConfirmDialogModule,
    PermissionMatrixComponent,
    TranslatePipe
  ],
  templateUrl: './admin-roles.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminRolesComponent {

  private readonly service = inject(AdminRoleService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly translate = inject(TranslateService);

  readonly roles = signal<AppRole[]>([]);
  readonly permissionRows = signal<PermissionRow[]>([]);

  readonly loading = signal(false);

  readonly formVisible = signal(false);
  readonly permissionsVisible = signal(false);

  readonly isNew = signal(true);
  readonly selectedRoleId = signal<number | null>(null);

  readonly form = this.fb.group({
    userrole: ['', Validators.required],
    designation: ['', Validators.required]
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
      .subscribe(data => this.roles.set(data));

  }

  isBuiltIn(role: AppRole): boolean {
    return BUILT_IN_ROLES.includes(role.userrole);
  }

  openCreate(): void {

    this.isNew.set(true);
    this.selectedRoleId.set(null);

    this.form.reset({
      userrole: '',
      designation: ''
    });

    this.formVisible.set(true);

  }

  openEdit(role: AppRole): void {

    this.isNew.set(false);
    this.selectedRoleId.set(role.id);

    this.form.reset({
      userrole: role.userrole,
      designation: role.designation
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

    const value = this.form.getRawValue();

    if (this.isNew()) {

      this.service.create(value)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.formVisible.set(false);
          this.load();
          this.messageService.add({
            severity: 'success',
            summary: this.translate.instant('admin.roles.created')
          });
        });

    } else {

      this.service.update(
        this.selectedRoleId()!,
        value.designation
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.formVisible.set(false);
        this.load();
        this.messageService.add({
          severity: 'success',
          summary: this.translate.instant('admin.roles.updated')
        });
      });

    }

  }

  confirmDelete(role: AppRole): void {

    this.confirmationService.confirm({

      message: this.translate.instant('admin.roles.confirmDelete', { designation: role.designation }),
      header: this.translate.instant('common.confirmationHeader'),
      icon: 'pi pi-exclamation-triangle',

      accept: () => {

        this.service.delete(role.id)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({

            next: () => {

              this.load();

              this.messageService.add({
                severity: 'success',
                summary: this.translate.instant('admin.roles.deleted')
              });

            },

            error: () => {

              this.messageService.add({
                severity: 'error',
                summary: this.translate.instant('admin.roles.deleteError'),
                detail: this.translate.instant('admin.roles.deleteErrorDetail')
              });

            }

          });

      }

    });

  }

  openPermissions(role: AppRole): void {

    this.selectedRoleId.set(role.id);

    this.service.getPermissions(role.id)
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
      this.selectedRoleId()!,
      this.permissionRows()
    )
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(() => {

      this.permissionsVisible.set(false);

      this.messageService.add({
        severity: 'success',
        summary: this.translate.instant('admin.roles.permissionsUpdated')
      });

    });

  }

}
