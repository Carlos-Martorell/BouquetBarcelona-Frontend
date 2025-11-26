import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { OrdersService } from '@core/services/order/orders';
import { NotificationService } from '@core/services/toast/notification';
import { OrderFormService } from '../../services/order-form/order-form';
import { CommonModule, DatePipe } from '@angular/common';
import { OrderForm } from "../../components/order-form/order-form";

@Component({
  selector: 'app-orders-management',
  imports: [CommonModule, DatePipe, OrderForm],
  templateUrl: './orders-management.html',
  styleUrl: './orders-management.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersManagement {
  ordersService = inject(OrdersService);
  notificationService = inject(NotificationService);
  formService = inject(OrderFormService);

  isLoading = signal(false);
  errorMessage = signal<string | null>(null)

  selectedStatus = signal<string>('all');
  searchQuery = signal('');

  filteredOrders = computed(() => {
    let orders = this.ordersService.orders()

    if(this.selectedStatus() !== 'all') {
      orders = orders.filter(o => o.status === this.selectedStatus());
    }

    const query = this.searchQuery().toLocaleLowerCase();
    if(query) {
      orders = orders.filter(o => 
        o.customerName.toLocaleLowerCase().includes(query) ||
        o.customerEmail.toLocaleLowerCase().includes(query) ||
        o.deliveryAddress.toLocaleLowerCase().includes(query)
      )
    }

    return orders.sort((a, b) => 
      new Date(b.deliveryDate).getTime() - new Date(a.deliveryDate).getTime()
    )
  })

  orderCount = computed(() => this.filteredOrders().length);

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.ordersService.getAll().subscribe({
      next: () => this.isLoading.set(false),
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('Error al cargar pedidos');
      }
    })
  }

  openCreateModal() {
    this.formService.openForCreate()
  }

  openEditModal(id: string) {
    this.formService.openForEdit(id)
  }

  deleteOrder(orderId: string, customerName: string) {
    if (!confirm(`¿Eliminar pedido de ${customerName}?`)) return;
    
    this.ordersService.delete(orderId).subscribe({
      next: () => this.notificationService.showSuccess(`Pedido de ${customerName} eliminado`),
      error: () => this.notificationService.showError('Error al eliminar el pedido')
    });
  }

  updateStatus(id: string, newStatus: string) {
    this.ordersService.updateStatus(id, newStatus).subscribe({
      next: () => {
        this.notificationService.showSuccess('Estado actualizado')
      },
      error: () => {
        this.notificationService.showError('Error al actualizar estado')
      }
    })
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
  
  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      pending: 'bg-secondary text-text',
      confirmed: 'bg-success text-white',
      delivered: 'bg-primary text-white',
      cancelled: 'bg-error text-white'
    };
    return colors[status] || 'bg-gray-500 text-white';
  }
}
