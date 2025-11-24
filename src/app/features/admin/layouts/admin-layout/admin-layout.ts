
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
 
  navItems = [
    { path: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/admin/flowers', icon: '🌸', label: 'Gestión de ramos' },
    { path: '/admin/calendar', icon: '📅', label: 'Calendario' },
    { path: '/admin/maps', icon: '🗺️', label: 'Mapa' },
    { path: '/admin/analytics', icon: '📈', label: 'Analytics' },
  ];
}