import { Routes } from '@angular/router';

export const routes: Routes = [
  // Ruta pública (futuro home de clientes)
//   {
//     path: 'home',
//     loadComponent: () => import('./features/public/pages/home/home')
//       .then(m => m.Home)
//   },
  
  // Rutas de admin (con layout)
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/layouts/admin-layout/admin-layout')
      .then(m => m.AdminLayout),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/admin/pages/dashboard/dashboard')
          .then(m => m.Dashboard)
      },
      {
        path: 'flowers',
        loadComponent: () => import('./features/admin/pages/flowers-management/flowers-management')
          .then(m => m.FlowersManagement)
      },
      {
        path: 'calendar',
        loadComponent: () => import('./features/admin/pages/calendar/calendar')
          .then(m => m.Calendar)
      },
      {
        path:'maps',
        loadComponent: () => 
            import('./features/admin/pages/maps/maps-management')
                .then(m => m.MapsManagement)
      },     
      {
        path:'analytics',
        loadComponent: () => 
            import('./features/admin/pages/analytics/analytics')
                .then(m => m.Analytics)
      }     
    ]
  },
  
  { 
    path: '', 
    // redirectTo: '/home', 
    redirectTo: '/admin', 
    pathMatch: 'full' 
  },
  
  // Cualquier otra ruta
  {
    path: '**',
    // redirectTo: '/home'
    redirectTo: '/admin'
  }
];
