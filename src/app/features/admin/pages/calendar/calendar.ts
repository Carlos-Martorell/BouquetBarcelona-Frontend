import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core'; // useful for typechecking
import { FullCalendarModule } from '@fullcalendar/angular';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';


@Component({
  selector: 'app-calendar',
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Calendar implements OnInit {
  
  ////////////
  events = signal([
    {
      id: '1',
      title: 'Pedido #001 - María García',
      start: new Date().toISOString().split('T')[0] + 'T10:00:00',
      end: new Date().toISOString().split('T')[0] + 'T12:00:00',
      backgroundColor: '#8fa998', // success
      borderColor: '#8fa998',
      extendedProps: {
        status: 'confirmed',
        address: 'Carrer de Balmes 123',
        total: 45
      }
    },
    {
      id: '2',
      title: 'Pedido #002 - Joan Puig',
      start: new Date().toISOString().split('T')[0] + 'T14:00:00',
      end: new Date().toISOString().split('T')[0] + 'T16:00:00',
      backgroundColor: '#c9a689', // secondary
      borderColor: '#c9a689',
      extendedProps: {
        status: 'pending',
        address: 'Avinguda Diagonal 456',
        total: 78
      }
    },
    {
      id: '3',
      title: 'Pedido #003 - Anna López',
      start: this.getTomorrowDate() + 'T09:00:00',
      end: this.getTomorrowDate() + 'T11:00:00',
      backgroundColor: '#744c3e', // primary
      borderColor: '#744c3e',
      extendedProps: {
        status: 'confirmed',
        address: 'Passeig de Gràcia 78',
        total: 120
      }
    }
  ]);


  // Evento seleccionado para mostrar detalles
  selectedEvent = signal<any>(null);
  
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    locale: 'es',
    firstDay: 1, // Lunes
    height: 'auto',
    events: this.events(),
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
  };


ngOnInit(): void {
  // Aquí cargar los pedidos reales del OrdersService
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

  private getTomorrowDate(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }


}
