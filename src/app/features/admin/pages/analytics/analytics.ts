import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FlowersService } from '@core/services/flowers/flowers';
import { OrdersService } from '@core/services/order/orders';

@Component({
  selector: 'app-analytics',
  imports: [],
  templateUrl: './analytics.html',
  styleUrl: './analytics.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Analytics implements OnInit {


  private ordersService = inject(OrdersService);
  private flowersService = inject(FlowersService);

  ngOnInit(): void {
    
  }
}
