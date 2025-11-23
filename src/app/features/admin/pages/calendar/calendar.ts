import { ChangeDetectionStrategy, Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarOptions, EventClickArg, EventInput } from '@fullcalendar/core'; // useful for typechecking
import { FullCalendarModule } from '@fullcalendar/angular';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import { OrdersService } from '@core/services/order/orders';


@Component({
  selector: 'app-calendar',
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Calendar implements OnInit {

  private ordersService = inject(OrdersService)
  


  // Evento seleccionado para mostrar detalles
  selectedEvent = signal<any>(null);
  successMessage = signal<string | null>(null);
  
  calendarOptions = signal<CalendarOptions>({
     plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
     initialView: 'dayGridMonth',
     headerToolbar: {
       left: 'prev,next today',
       center: 'title',
       right: 'dayGridMonth,timeGridWeek,timeGridDay'
     },
     locale: 'es',
     firstDay: 1,
     height: 'auto',
     events: [], // ← Inicialmente vacío
     eventClick: this.handleEventClick.bind(this),
     eventTimeFormat: {
       hour: '2-digit',
       minute: '2-digit',
       meridiem: false,
       hour12: false
     },
     buttonText: {
       today: 'Hoy',
       month: 'Mes',
       week: 'Semana',
       day: 'Día'
     }
   });


constructor() {
    effect(() => {
      const events = this.ordersService.orders().map(order => ({
        id: order._id,
        title: `${order.customerName}`,
        start: `${order.deliveryDate.split('T')[0]}T${order.deliveryTime.split('-')[0]}:00`,
        end: `${order.deliveryDate.split('T')[0]}T${order.deliveryTime.split('-')[1]}:00`,
        backgroundColor: this.getStatusColor(order.status),
        borderColor: this.getStatusColor(order.status),
        extendedProps: {
          customerName: order.customerName,
          customerPhone: order.customerPhone,
          address: order.deliveryAddress,
          total: order.total,
          status: order.status,
          items: order.items
        }
      })) 
    this.calendarOptions.update(options => ({
      ...options,
      events: events
    }));
    })
}
      
ngOnInit(): void {
  this.ordersService.getAll().subscribe()
}

  handleEventClick(clickInfo: EventClickArg) {
    this.selectedEvent.set({
      id: clickInfo.event.id,
      title: clickInfo.event.title,
      start: clickInfo.event.start,
      end: clickInfo.event.end,
      ...clickInfo.event.extendedProps
    });
  }

  closeEventDetails() {
    this.selectedEvent.set(null);
  }

  private getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      pending: 'var(--color-secondary)',   
      confirmed: 'var(--color-success)',    
      delivered: 'var(--color-primary)',   
      cancelled: 'var(--color-error)'
    };
    return colors[status] || '#744c3e';
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


  updateOrderStatus(orderId: string, newStatus: string) {
    this.ordersService.update(orderId, { status: newStatus as any }).subscribe({
      next: () => {
        this.successMessage.set('✅ Estado actualizado correctamente');
        setTimeout(() => this.successMessage.set(null), 3000);
        this.closeEventDetails();
      },
      error: (err) => {
        this.successMessage.set('❌ Error al actualizar');
      setTimeout(() => this.successMessage.set(null), 3000);
      }

    });
  }

}
