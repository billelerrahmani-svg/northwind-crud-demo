import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

/** Régénéré à chaque génération pour refléter la liste des tables/vues sélectionnées. */
export const routes: Routes = [

  {
    path: 'login',
    pathMatch: 'full',
    loadComponent: () =>
      import('./features/login/login.component')
        .then(m => m.LoginComponent)
  },

  {
    path: '',
    canMatch: [authGuard],
    loadComponent: () =>
      import('./layout/main-layout.component')
        .then(m => m.MainLayoutComponent),

    children: [

      {
        path: 'home',
        loadComponent: () =>
          import('./features/home/home.component')
            .then(m => m.HomeComponent)
      },

      {
        path: 'exploitation',
        pathMatch: 'full',
        redirectTo: 'exploitation/categories'
      },

      {
        path: 'reporting',
        pathMatch: 'full',
        redirectTo: 'reporting/current-product-list'
      },

  {
    path: 'exploitation/categories',
    loadComponent: () =>
      import('./features/categories/categories-list.component')
        .then(m => m.CategoriesListComponent)
  },

  {
    path: 'exploitation/categories/nouveau',
    loadComponent: () =>
      import('./features/categories/categories-form.component')
        .then(m => m.CategoriesFormComponent)
  },

  {
    path: 'exploitation/categories/:categoryid/modifier',
    loadComponent: () =>
      import('./features/categories/categories-form.component')
        .then(m => m.CategoriesFormComponent)
  },

  {
    path: 'exploitation/customers',
    loadComponent: () =>
      import('./features/customers/customers-list.component')
        .then(m => m.CustomersListComponent)
  },

  {
    path: 'exploitation/customers/nouveau',
    loadComponent: () =>
      import('./features/customers/customers-form.component')
        .then(m => m.CustomersFormComponent)
  },

  {
    path: 'exploitation/customers/:customerid/modifier',
    loadComponent: () =>
      import('./features/customers/customers-form.component')
        .then(m => m.CustomersFormComponent)
  },

  {
    path: 'exploitation/employees',
    loadComponent: () =>
      import('./features/employees/employees-list.component')
        .then(m => m.EmployeesListComponent)
  },

  {
    path: 'exploitation/employees/nouveau',
    loadComponent: () =>
      import('./features/employees/employees-form.component')
        .then(m => m.EmployeesFormComponent)
  },

  {
    path: 'exploitation/employees/:employeeid/modifier',
    loadComponent: () =>
      import('./features/employees/employees-form.component')
        .then(m => m.EmployeesFormComponent)
  },

  {
    path: 'exploitation/employeeterritories',
    loadComponent: () =>
      import('./features/employeeterritories/employeeterritories-list.component')
        .then(m => m.EmployeeterritoriesListComponent)
  },

  {
    path: 'exploitation/employeeterritories/nouveau',
    loadComponent: () =>
      import('./features/employeeterritories/employeeterritories-form.component')
        .then(m => m.EmployeeterritoriesFormComponent)
  },

  {
    path: 'exploitation/employeeterritories/:employeeid/:territoryid/modifier',
    loadComponent: () =>
      import('./features/employeeterritories/employeeterritories-form.component')
        .then(m => m.EmployeeterritoriesFormComponent)
  },

  {
    path: 'exploitation/order-details',
    loadComponent: () =>
      import('./features/order-details/order-details-list.component')
        .then(m => m.OrderDetailsListComponent)
  },

  {
    path: 'exploitation/order-details/nouveau',
    loadComponent: () =>
      import('./features/order-details/order-details-form.component')
        .then(m => m.OrderDetailsFormComponent)
  },

  {
    path: 'exploitation/order-details/:orderid/:productid/modifier',
    loadComponent: () =>
      import('./features/order-details/order-details-form.component')
        .then(m => m.OrderDetailsFormComponent)
  },

  {
    path: 'exploitation/orders',
    loadComponent: () =>
      import('./features/orders/orders-list.component')
        .then(m => m.OrdersListComponent)
  },

  {
    path: 'exploitation/orders/nouveau',
    loadComponent: () =>
      import('./features/orders/orders-form.component')
        .then(m => m.OrdersFormComponent)
  },

  {
    path: 'exploitation/orders/:orderid/modifier',
    loadComponent: () =>
      import('./features/orders/orders-form.component')
        .then(m => m.OrdersFormComponent)
  },

  {
    path: 'exploitation/products',
    loadComponent: () =>
      import('./features/products/products-list.component')
        .then(m => m.ProductsListComponent)
  },

  {
    path: 'exploitation/products/nouveau',
    loadComponent: () =>
      import('./features/products/products-form.component')
        .then(m => m.ProductsFormComponent)
  },

  {
    path: 'exploitation/products/:productid/modifier',
    loadComponent: () =>
      import('./features/products/products-form.component')
        .then(m => m.ProductsFormComponent)
  },

  {
    path: 'exploitation/region',
    loadComponent: () =>
      import('./features/region/region-list.component')
        .then(m => m.RegionListComponent)
  },

  {
    path: 'exploitation/region/nouveau',
    loadComponent: () =>
      import('./features/region/region-form.component')
        .then(m => m.RegionFormComponent)
  },

  {
    path: 'exploitation/region/:regionid/modifier',
    loadComponent: () =>
      import('./features/region/region-form.component')
        .then(m => m.RegionFormComponent)
  },

  {
    path: 'exploitation/shippers',
    loadComponent: () =>
      import('./features/shippers/shippers-list.component')
        .then(m => m.ShippersListComponent)
  },

  {
    path: 'exploitation/shippers/nouveau',
    loadComponent: () =>
      import('./features/shippers/shippers-form.component')
        .then(m => m.ShippersFormComponent)
  },

  {
    path: 'exploitation/shippers/:shipperid/modifier',
    loadComponent: () =>
      import('./features/shippers/shippers-form.component')
        .then(m => m.ShippersFormComponent)
  },

  {
    path: 'exploitation/suppliers',
    loadComponent: () =>
      import('./features/suppliers/suppliers-list.component')
        .then(m => m.SuppliersListComponent)
  },

  {
    path: 'exploitation/suppliers/nouveau',
    loadComponent: () =>
      import('./features/suppliers/suppliers-form.component')
        .then(m => m.SuppliersFormComponent)
  },

  {
    path: 'exploitation/suppliers/:supplierid/modifier',
    loadComponent: () =>
      import('./features/suppliers/suppliers-form.component')
        .then(m => m.SuppliersFormComponent)
  },

  {
    path: 'exploitation/territories',
    loadComponent: () =>
      import('./features/territories/territories-list.component')
        .then(m => m.TerritoriesListComponent)
  },

  {
    path: 'exploitation/territories/nouveau',
    loadComponent: () =>
      import('./features/territories/territories-form.component')
        .then(m => m.TerritoriesFormComponent)
  },

  {
    path: 'exploitation/territories/:territoryid/modifier',
    loadComponent: () =>
      import('./features/territories/territories-form.component')
        .then(m => m.TerritoriesFormComponent)
  },

  {
    path: 'reporting/current-product-list',
    loadComponent: () =>
      import('./features/current-product-list/current-product-list-list.component')
        .then(m => m.CurrentProductListListComponent)
  },


      {
        path: 'admin',
        pathMatch: 'full',
        redirectTo: 'admin/users'
      },

      {
        path: 'admin/users',
        canMatch: [adminGuard],
        loadComponent: () =>
          import('./features/admin/admin-users/admin-users.component')
            .then(m => m.AdminUsersComponent)
      },

      {
        path: 'admin/roles',
        canMatch: [adminGuard],
        loadComponent: () =>
          import('./features/admin/admin-roles/admin-roles.component')
            .then(m => m.AdminRolesComponent)
      },

      {
        path: 'admin/api-keys',
        canMatch: [adminGuard],
        loadComponent: () =>
          import('./features/admin/admin-api-keys/admin-api-keys.component')
            .then(m => m.AdminApiKeysComponent)
      },

      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }

    ]
  },

  {
    path: '**',
    redirectTo: ''
  }

];
