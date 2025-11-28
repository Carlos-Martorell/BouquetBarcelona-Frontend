
import { DecimalPipe, JsonPipe } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, effect, ElementRef, inject, OnDestroy, signal, viewChild } from '@angular/core';
import { OrdersService } from '@core/services/order/orders';
import { environment } from '@env/environments';
import mapboxgl from 'mapbox-gl'

mapboxgl.accessToken = environment.mapboxKey;

@Component({
  selector: 'app-maps-management',
  imports: [DecimalPipe, JsonPipe],
  templateUrl: './maps-management.html',
  styleUrl: './maps-management.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapsManagement implements AfterViewInit, OnDestroy {
  
  private ordersService = inject(OrdersService);
  

  divElement = viewChild<ElementRef>('map');
  
  private readonly TALLER_COORDS: [number, number] = [2.1282850355819614, 41.37804698233292];
  

  map = signal<mapboxgl.Map | null>(null);
  
  zoom = signal<number>(13)
  coordinates = signal({
    lng: 2.1686,
    lat: 41.3874,
  })

  zoomEffect = effect(() => {
    const currentMap = this.map();
    const newZoom = this.zoom();
    
    if (!currentMap) return;

    if (Math.abs(currentMap.getZoom() - newZoom) > 0.01) {
      currentMap.setZoom(newZoom);
    }
  });


  async ngAfterViewInit() {

    if(!this.divElement()?.nativeElement) return

    await new Promise((resolve) => setTimeout(resolve, 80));

    const element = this.divElement()!.nativeElement;
    const {lng, lat} = this.coordinates()
    
    const mapInstance = new mapboxgl.Map({
      container: element,
      style: 'mapbox://styles/mapbox/streets-v12', 
      center: [lng, lat],
      zoom: this.zoom(), 
    });
    
    this.mapListeners(mapInstance);
    this.map.set(mapInstance); 
  }


  mapListeners (mapInstance: mapboxgl.Map) {
    

    mapInstance.on('zoomend', (event) => {
      const newZoom = event.target.getZoom();
      this.zoom.set(newZoom) 
    })

    mapInstance.on('moveend', () => {
      const center = mapInstance.getCenter();
      this.coordinates.set(center)
    })
    
    mapInstance.addControl(new mapboxgl.FullscreenControl());
    mapInstance.addControl(new mapboxgl.NavigationControl());
    mapInstance.addControl(new mapboxgl.ScaleControl());
    
    mapInstance.on('load', () => {
      this.addTallerMarker();
      this.loadOrders();
    });
  }


  private addTallerMarker(): void {
    const currentMap = this.map();
    if (!currentMap) return;
    
    new mapboxgl.Marker({ color: '#2d3748' }) 
      .setLngLat(this.TALLER_COORDS)
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div class="p-2">
            <p class=" text-sm font-bold text-primary">🏠 Taller</p>
            <p class="text-sm text-text/70">Punto de partida</p>
          </div>
        `)
      )
     
      .addTo(currentMap); 
  }

  private loadOrders(): void {
    
    if (this.ordersService.orders().length === 0) {
      this.ordersService.getAll().subscribe(() => {
        this.addOrderMarkers();
      });
    } else {
      this.addOrderMarkers();
    }
  }

  private addOrderMarkers(): void {
    const todayOrders = this.ordersService.todayOrders();
    const currentMap = this.map(); 
    if (!currentMap) return;

    todayOrders.forEach(order => {
      if (!order.coordinates) return;

      const color = '#8fa998';

      new mapboxgl.Marker({ color })
        .setLngLat([order.coordinates.lng, order.coordinates.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div class="p-2">
                <p class="font-bold text-sm text-primary">${order.customerName}</p>
                <p class="text-sm text-text/70">${order.deliveryTime}</p>
                <p class="text-sm text-text/70">${order.deliveryAddress}</p>
                <p class="text-sm font-semibold text-primary mt-1">${order.total}€</p>
              </div>
            `)
        )
        .addTo(currentMap); 
  });

    if (todayOrders.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      todayOrders.forEach(order => {
        if (order.coordinates) {
          bounds.extend([order.coordinates.lng, order.coordinates.lat]);
        }
      });

      currentMap.fitBounds(bounds, { padding: 50, maxZoom: 13 }); 
    }
  }


  ngOnDestroy(): void {
    this.map()?.remove(); 
  }
}