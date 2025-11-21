import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FlowersService } from '@core/services/flowers/flowers';
import { OrdersService } from '@core/services/order/orders';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {
  ordersService = inject(OrdersService);
  flowersService = inject(FlowersService);

  ngOnInit() {
    this.ordersService.getAll().subscribe();
    this.flowersService.getAll().subscribe();
  }

    getStatusBadgeClasses(status: string): string {
    const classes: Record<string, string> = {
      pending: 'bg-secondary text-text',
      confirmed: 'bg-success text-white',
      delivered: 'bg-primary text-white',
      cancelled: 'bg-error text-white'
    };
  return classes[status] || 'bg-secondary text-text';
}

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      pending: 'Pendiente',
      confirmed: 'Confirmado',
      delivered: 'Entregado',
      cancelled: 'Cancelado'
    };
    return labels[status] || status;
  }
}
