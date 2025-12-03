import { Routes } from '@angular/router';
import { adminGuard } from '@core/services/auth/admin-guard';
import { authGuard } from '@core/services/auth/auth-guard';
import { guestGuard } from '@core/services/auth/guest-guard';

export const routes: Routes = [

  {
    path: '',
    loadComponent: () => import('./features/client/pages/home/home')
      .then(m => m.Home)
  },

  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/pages/login/login')
      .then(m => m.Login)
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/pages/register/register')
      .then(m => m.Register)
  },
  
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./features/admin/layouts/admin-layout/admin-layout').then(m => m.AdminLayout),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/admin/pages/dashboard/dashboard').then(m => m.Dashboard),
      },
      {
        path: 'flowers',
        loadComponent: () =>
          import('./features/admin/pages/flowers-management/flowers-management').then(
            m => m.FlowersManagement
          ),
      },
      {
        path: 'calendar',
        loadComponent: () =>
          import('./features/admin/pages/calendar/calendar').then(m => m.Calendar),
      },
      {
        path: 'maps',
        loadComponent: () =>
          import('./features/admin/pages/maps/maps-management').then(m => m.MapsManagement),
      },
      {
        path: 'analytics',
        loadComponent: () =>
          import('./features/admin/pages/analytics/analytics').then(m => m.Analytics),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./features/admin/pages/orders-management/orders-management').then(
            m => m.OrdersManagement
          ),
      },
    ],
  },

  {
    path: '**',
    redirectTo: '',
  },
];
