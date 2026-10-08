import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { LanguageService, AppLang } from '../../core/services/language.service';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    MessageModule,
    TranslatePipe
  ],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {

  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly translate = inject(TranslateService);

      protected readonly language = inject(LanguageService);

      readonly languageOptions: { label: string; value: AppLang }[] = [
        { label: 'FR', value: 'fr' },
        { label: 'EN', value: 'en' },
        { label: 'AR', value: 'ar' }
      ];

      onLanguageChange(lang: AppLang): void {
        this.language.setLanguage(lang);
      }

  readonly loading = signal(false);
  readonly errorMessage = signal('');

  readonly loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  onSubmit(): void {

    if (this.loading()) {
      return;
    }

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { username, password } = this.loginForm.getRawValue();

    this.loading.set(true);
    this.errorMessage.set('');

    this.auth.login(username, password)
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {

          const returnUrl =
            this.route.snapshot.queryParamMap.get('returnUrl') ?? '/';

          this.router.navigateByUrl(returnUrl);

        },
        error: () => {
          this.errorMessage.set(
            this.translate.instant('auth.login.error')
          );
        }
      });

  }

}
