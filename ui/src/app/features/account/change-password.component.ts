import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { DialogModule } from 'primeng/dialog';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    PasswordModule,
    ButtonModule,
    MessageModule,
    ToastModule,
    TranslatePipe
  ],
  templateUrl: './change-password.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangePasswordComponent {

  private readonly auth = inject(AuthService);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly messageService = inject(MessageService);
  private readonly translate = inject(TranslateService);


  readonly visible = input(false);
  readonly visibleChange = output<boolean>();

  readonly loading = signal(false);
  readonly errorMessage = signal('');

  readonly form = this.fb.group({
    oldPassword: ['', Validators.required],
    newPassword: ['', Validators.required],
    confirmPassword: ['', Validators.required]
  });

  onHide(): void {
    this.form.reset();
    this.errorMessage.set('');
    this.loading.set(false);
    this.visibleChange.emit(false);
  }

  onSubmit(): void {

    if (this.loading()) {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const {
      oldPassword,
      newPassword,
      confirmPassword
    } = this.form.getRawValue();

    this.errorMessage.set('');

    if (newPassword !== confirmPassword) {
      this.errorMessage.set(
        this.translate.instant('auth.changePassword.mismatch')
      );
      return;
    }

    this.loading.set(true);

    this.auth.changePassword(oldPassword, newPassword)
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {

          this.messageService.add({
            severity: 'success',
            summary: this.translate.instant('common.success'),
            detail: this.translate.instant('auth.changePassword.success')
          });

          this.onHide();

        },
        error: () => {
          this.errorMessage.set(
            this.translate.instant('auth.changePassword.oldPasswordInvalid')
          );
        }
      });

  }

}
