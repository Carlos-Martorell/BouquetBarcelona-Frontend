import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-orders-management',
  imports: [],
  templateUrl: './orders-management.html',
  styleUrl: './orders-management.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersManagement {
  ordersService = inject(OrdersService);
  notificationService = inject(NotificationService); // ← Reutilizamos
  formService = inject(OrderFormService);

  isLoading = signal(false);
  errorMessage = signal<string|null>(null)
}
