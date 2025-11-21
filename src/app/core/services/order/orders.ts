import { computed, Injectable, signal } from '@angular/core';
import { Order } from '@core/models/order';
import { isToday, format, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';

@Injectable({
  providedIn: 'root',
})
export class Orders {
  private ordersSignals = signal<Order[]>([]);
  readonly orders = this.ordersSignals.asReadonly();

  readonly todayOrders = computed(() => {
    return this.orders().filter(o => isToday(o.deliveryDate));
  });

  readonly pendingOrders = computed(() => {
    return this.orders().filter(o => o.status === 'pending');
  });

  readonly todayTotal = computed(() =>
    this.todayOrders().reduce((sum, o) => sum + o.total, 0)
  );
}
