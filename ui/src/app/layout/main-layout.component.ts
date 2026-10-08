import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet, NavigationEnd } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MenuItem } from 'primeng/api';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { LanguageService, AppLang } from '../core/services/language.service';

import { AuthService } from '../core/services/auth.service';
import { ChangePasswordComponent } from '../features/account/change-password.component';

interface SidebarItem {
  label: string;
  route: string;
  icon: string;
}

type Section = 'home' | 'exploitation' | 'reporting' | 'admin';

/**
 * Régénéré automatiquement afin de refléter les tables/vues sélectionnées.
 * Le menu latéral est contextuel : son contenu dépend de la section active
 * (Exploitation = tables, Reporting = vues, Admin = utilisateurs/rôles/clés API),
 * et il est masqué sur l'accueil.
 */
@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    ButtonModule,
    MenuModule,
    ToastModule,
    ConfirmDialogModule,
                ChangePasswordComponent,
                TranslatePipe
  ],
  templateUrl: './main-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainLayoutComponent {

  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
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


  readonly appTitle = 'Espace de gestion';

  readonly collapsed = signal(false);

  readonly changePasswordVisible = signal(false);

  readonly isAdmin = computed(() => this.auth.isAdmin());

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(event => event.urlAfterRedirects)
    ),
    { initialValue: this.router.url }
  );

  readonly currentSection = computed<Section>(() => {
    const url = this.currentUrl();
    if (url.startsWith('/exploitation')) return 'exploitation';
    if (url.startsWith('/reporting')) return 'reporting';
    if (url.startsWith('/admin')) return 'admin';
    return 'home';
  });

  readonly exploitationItems: SidebarItem[] = [
    { label: 'entities.categories', route: '/exploitation/categories', icon: 'pi pi-table' },
    { label: 'entities.customers', route: '/exploitation/customers', icon: 'pi pi-table' },
    { label: 'entities.employees', route: '/exploitation/employees', icon: 'pi pi-table' },
    { label: 'entities.employeeterritories', route: '/exploitation/employeeterritories', icon: 'pi pi-table' },
    { label: 'entities.order-details', route: '/exploitation/order-details', icon: 'pi pi-table' },
    { label: 'entities.orders', route: '/exploitation/orders', icon: 'pi pi-table' },
    { label: 'entities.products', route: '/exploitation/products', icon: 'pi pi-table' },
    { label: 'entities.region', route: '/exploitation/region', icon: 'pi pi-table' },
    { label: 'entities.shippers', route: '/exploitation/shippers', icon: 'pi pi-table' },
    { label: 'entities.suppliers', route: '/exploitation/suppliers', icon: 'pi pi-table' },
    { label: 'entities.territories', route: '/exploitation/territories', icon: 'pi pi-table' },
  ];

  readonly reportingItems: SidebarItem[] = [
    { label: 'entities.current-product-list', route: '/reporting/current-product-list', icon: 'pi pi-table' },
  ];

  readonly userMenuItems: MenuItem[] = [
        {
          label: this.translate.instant('layout.changePassword'),
          icon: 'pi pi-key',
          command: () => this.changePasswordVisible.set(true)
        },
        {
          separator: true
        },
    {
      label: this.translate.instant('layout.logout'),
      icon: 'pi pi-sign-out',
      command: () => this.logout()
    }
  ];

  toggleSidebar(): void {
    this.collapsed.update(value => !value);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

}
