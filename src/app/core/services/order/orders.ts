import { computed, inject, Injectable, signal } from '@angular/core';
import { CreateOrder, Order, UpdateOrder } from '@core/models/order';
import { environment } from '@env/environments';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {

  private http = inject(HttpClient)
  private readonly apiUrlLH = 'http://localhost:3000/api/orders'
  private readonly apiUrl = `${environment.apiUrl}/api/orders`;
  
  private ordersSignal = signal<Order[]>([]);
  readonly orders = this.ordersSignal.asReadonly();
  

  readonly orderCount = computed(() => this.orders().length);

 readonly todayOrders = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return this.orders().filter(order => {
    const orderDate = new Date(order.deliveryDate);
    orderDate.setHours(0, 0, 0, 0);
    return orderDate.getTime() === today.getTime();
  });
});

  readonly pendingOrders = computed(() =>
    this.orders().filter(order => order.status === 'pending')
  );

  readonly confirmedOrders = computed(() =>
    this.orders().filter(order => order.status === 'confirmed')
  );

  readonly deliveredOrders = computed(() =>
    this.orders().filter(order => order.status === 'delivered')
  );

  readonly todayTotal = computed(() =>
    this.todayOrders().reduce((sum, order) => sum + order.total, 0)
  );

  getAll(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl).pipe(
      tap(orders => this.ordersSignal.set(orders))
    );
  }

  getOne(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }

  create(order: CreateOrder): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, order).pipe(
      tap(newOrder => {
        this.ordersSignal.update(orders => [...orders, newOrder]);
      })
    );
  }

  update(id: string, order: UpdateOrder): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/${id}`, order).pipe(
      tap(updatedOrder => {
        this.ordersSignal.update(orders =>
          orders.map(o => o._id === id ? updatedOrder : o)
        );
      })
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.ordersSignal.update(orders =>
          orders.filter(o => o._id !== id)
        );
      })
    );
  }

  getByStatus(status: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}?status=${status}`);
  }

  getByDate(date: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}?date=${date}`);
  }

  getShortId(id: string): string {
    return id.slice(4, 8).toUpperCase();
  }

  readonly todayOrdersSorted = computed(() => {
      return this.todayOrders().sort((a, b) => {
      // Extraer horas de inicio
      const startA = a.deliveryTime.split('-')[0];
      const startB = b.deliveryTime.split('-')[0];

      // Si las horas de inicio son iguales, ordenar por duración (más corta primero)
      if (startA === startB) {
        const endA = a.deliveryTime.split('-')[1];
        const endB = b.deliveryTime.split('-')[1];
        
        const durationA = this.getTimeDifference(startA, endA);
        const durationB = this.getTimeDifference(startB, endB);
        
        return durationA - durationB; // Más corta primero
      }

      // Ordenar por hora de inicio
      return startA.localeCompare(startB);
      });
  });

  // Helper: Calcular diferencia en minutos
  private getTimeDifference(start: string, end: string): number {
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);
    
    return (endH * 60 + endM) - (startH * 60 + startM);
  }

  updateStatus(id: string, status: string): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/${id}/status`, { status })
      .pipe(
        tap(updatedOrder => {
          this.ordersSignal.update(orders =>
            orders.map(o => o._id === id ? updatedOrder : o)
          );
        })
      );
  }

}
