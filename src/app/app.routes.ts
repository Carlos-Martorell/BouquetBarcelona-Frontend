import { Routes } from '@angular/router';
import { FlowersManagement } from './features/admin/pages/flowers-management/flowers-management';
export const routes: Routes = [
    {
        path:'',
        redirectTo: 'admin/flowers',
        pathMatch: 'full'
    },
    {
        path:'admin/flowers',
        component: FlowersManagement
    }
];
