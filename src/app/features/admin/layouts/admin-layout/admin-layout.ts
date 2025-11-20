// src/app/features/admin/layouts/admin-layout/admin-layout.ts
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css'
})
export class AdminLayout {
  // Array de navegación (fácil de modificar)
  navItems = [
    { path: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/admin/flowers', icon: '🌸', label: 'Gestión de ramos' },
    { path: '/admin/calendar', icon: '📅', label: 'Calendario' },
  ];
}