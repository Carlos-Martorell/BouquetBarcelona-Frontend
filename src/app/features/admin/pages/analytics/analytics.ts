import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { DecimalPipe, CommonModule } from '@angular/common';
import { FlowersService } from '@core/services/flowers/flowers';
import { OrdersService } from '@core/services/order/orders';
import { OrdersDoughnut } from './components/orders-doughnut/orders-doughnut';
import { SalesLineChart } from './components/sales-line-chart/sales-line-chart';
import { ProductsBarChart } from './components/products-bar-chart/products-bar-chart';


@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, SalesLineChart, OrdersDoughnut, ProductsBarChart],
  templateUrl: './analytics.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Analytics implements OnInit {
  
  private ordersService = inject(OrdersService);
  private flowersService = inject(FlowersService);


  currentWeekOrders = computed(() => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1); 
    startOfWeek.setHours(0, 0, 0, 0);

    return this.ordersService.orders().filter(order => {
      const orderDate = new Date(order.deliveryDate);
      return orderDate >= startOfWeek;
    });
  });

  weeklyRevenue = computed(() =>
    this.currentWeekOrders().reduce((sum, o) => sum + o.total, 0)
  );

  weeklyOrders = computed(() => this.currentWeekOrders().length);



  currentMonthOrders = computed(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return this.ordersService.orders().filter(order => {
      const orderDate = new Date(order.deliveryDate);
      return orderDate >= startOfMonth;
    });
  });

  monthlyRevenue = computed(() =>
    this.currentMonthOrders().reduce((sum, o) => sum + o.total, 0)
  );

  monthlyOrders = computed(() => this.currentMonthOrders().length);





  topProducts = computed(() => {
    const orders = this.ordersService.orders();
    const productSales = new Map<string, { name: string; quantity: number }>();

    orders.forEach(order => {
      order.items.forEach(item => {
        const existing = productSales.get(item.flowerId);
        if (existing) {
          existing.quantity += item.quantity;
        } else {
          productSales.set(item.flowerId, {
            name: item.flowerName,
            quantity: item.quantity
          });
        }
      });
    });

    const sorted = Array.from(productSales.values())
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    return {
      labels: sorted.map(p => p.name),
      data: sorted.map(p => p.quantity)
    };
  });


  


  last7DaysLabels = computed(() => {
    const labels: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      labels.push(date.toLocaleDateString('es-ES', { 
        weekday: 'short', 
        day: 'numeric' 
      }));
    }
    return labels;
  });

  last7DaysSales = computed(() => {
    const sales: number[] = [];
    const orders = this.ordersService.orders();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const dayTotal = orders
        .filter(order => {
          const orderDate = new Date(order.deliveryDate);
          orderDate.setHours(0, 0, 0, 0);
          return orderDate.getTime() === date.getTime();
        })
        .reduce((sum, order) => sum + order.total, 0);
      
      sales.push(dayTotal);
    }
    return sales;
  });


  



  ordersByStatus = computed(() => {
    const orders = this.ordersService.orders();
    return {
      labels: ['Pendientes', 'Confirmados', 'Entregados'],
      data: [
        orders.filter(o => o.status === 'pending').length,
        orders.filter(o => o.status === 'confirmed').length,
        orders.filter(o => o.status === 'delivered').length,
      ],
      colors: ['#c9a689', '#8fa998', '#744c3e'] 
    };
  });

ngOnInit() {
  
  this.ordersService.getAll().subscribe();
  
  this.flowersService.getAll().subscribe();
}
}