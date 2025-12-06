import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@core/services/auth/auth';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout {
  navItems = [
    { path: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/admin/flowers', icon: '🌸', label: 'Gestión de ramos' },
    { path: '/admin/calendar', icon: '📅', label: 'Calendario' },
    { path: '/admin/maps', icon: '🗺️', label: 'Mapa' },
    { path: '/admin/analytics', icon: '📈', label: 'Análisis' },
    { path: '/admin/orders', icon: '📦', label: 'Gestión de pedidos' },
  ];

  private authService = inject(AuthService);

  // Método que será llamado por el botón
  onLogout() {
    this.authService.logout();
  }
}
