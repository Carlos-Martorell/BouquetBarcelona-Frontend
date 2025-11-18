import { Routes } from '@angular/router';
export const routes: Routes = [
    {
        path:'',
        redirectTo: 'admin/flowers',
        pathMatch: 'full'
    },
{
        path: 'admin/flowers',
        loadComponent: () => 
            import('./features/admin/pages/flowers-management/flowers-management')
                .then(m => m.FlowersManagement) 
    }
];
