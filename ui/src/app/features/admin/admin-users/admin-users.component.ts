import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { ConfirmationService, MessageService } from 'primeng/api';

import { AdminUserService } from '../../../core/services/admin-user.service';
import { AdminRoleService } from '../../../core/services/admin-role.service';
import { AppUser } from '../../../core/models/user.model';
import { AppRole } from '../../../core/models/role.model';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';

/**
 * Personnalisez librement cet écran : il n'est jamais écrasé par une
 * régénération une fois créé.
 */
@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    PasswordModule,
    SelectModule,
    CheckboxModule,
    ConfirmDialogModule,
    TranslatePipe
  ],
  templateUrl: './admin-users.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminUsersComponent {

  private readonly userService = inject(AdminUserService);
  private readonly roleService = inject(AdminRoleService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly translate = inject(TranslateService);

  readonly users = signal<AppUser[]>([]);
  readonly roles = signal<AppRole[]>([]);

  readonly loading = signal(false);

  readonly formVisible = signal(false);
  readonly resetPasswordVisible = signal(false);

  readonly isNew = signal(true);

  readonly selectedUserId = signal<number | null>(null);

  readonly form = this.fb.group({
    username: ['', Validators.required],
    password: [''],
    enabled: true,
    roleId: null as number | null
  });

  readonly resetPasswordForm = this.fb.group({
    password: ['', Validators.required]
  });

  constructor() {
    this.load();

    this.roleService.getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => this.roles.set(data));
  }

  load(): void {

    this.loading.set(true);

    this.userService.getAll()
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(data => this.users.set(data));

  }

  openCreate(): void {

    this.isNew.set(true);
    this.selectedUserId.set(null);

    this.form.reset({
      username: '',
      password: '',
      enabled: true,
      roleId: null
    });

    this.formVisible.set(true);

  }

  openEdit(user: AppUser): void {

    this.isNew.set(false);
    this.selectedUserId.set(user.id!);

    this.form.reset({
      username: user.username,
      password: '',
      enabled: user.enabled,
      roleId: user.roleId ?? null
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

      this.userService.create({
        username: value.username,
        password: value.password,
        enabled: value.enabled,
        roleId: value.roleId ?? undefined
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.formVisible.set(false);
        this.load();
        this.messageService.add({
          severity: 'success',
          summary: this.translate.instant('admin.users.created')
        });
      });

    } else {

      this.userService.update(
        this.selectedUserId()!,
        {
          roleId: value.roleId,
          enabled: value.enabled
        }
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.formVisible.set(false);
        this.load();
        this.messageService.add({
          severity: 'success',
          summary: this.translate.instant('admin.users.updated')
        });
      });

    }

  }

  confirmDelete(user: AppUser): void {

    this.confirmationService.confirm({

      message: this.translate.instant('admin.users.confirmDelete', { username: user.username }),
      header: this.translate.instant('common.confirmationHeader'),
      icon: 'pi pi-exclamation-triangle',

      accept: () => {

        this.userService.delete(user.id!)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {

            this.load();

            this.messageService.add({
              severity: 'success',
              summary: this.translate.instant('admin.users.deleted')
            });

          });

      }

    });

  }

  openResetPassword(user: AppUser): void {

    this.selectedUserId.set(user.id!);

    this.resetPasswordForm.reset({
      password: ''
    });

    this.resetPasswordVisible.set(true);

  }

  onResetPassword(): void {

    if (this.resetPasswordForm.invalid) {
      this.resetPasswordForm.markAllAsTouched();
      return;
    }

    this.userService.resetPassword(
      this.selectedUserId()!,
      this.resetPasswordForm.getRawValue().password
    )
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(() => {

      this.resetPasswordVisible.set(false);

      this.messageService.add({
        severity: 'success',
        summary: this.translate.instant('admin.users.passwordReset')
      });

    });

  }

}
