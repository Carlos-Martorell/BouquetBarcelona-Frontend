import { TestBed } from '@angular/core/testing';

import { CreateOrder, Order, UpdateOrder } from '@core/models/order';
import { OrdersService } from './orders';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '@env/environments';
import { provideHttpClient } from '@angular/common/http';

const mockOrders: Order[] = [
  {
    _id: 'order1',
    customerName: 'Ana García',
    customerEmail: 'ana@test.com',
    customerPhone: '+34 666555444',
    deliveryAddress: 'Carrer Aribau 123, Barcelona',
    deliveryDetails: 'Piso 3, Puerta B',
    coordinates: { lat: 41.3937, lng: 2.1545 },
    items: [{ flowerId: 'flower1', flowerName: 'Ramo Primaveral', quantity: 2, price: 35 }],
    total: 70,
    status: 'pending',
    deliveryDate: '2025-11-28',
    deliveryTime: '10:00-11:00',
    notes: 'Llamar antes de subir',
  },
  {
    _id: 'order2',
    customerName: 'Juan Pérez',
    customerEmail: 'juan@test.com',
    customerPhone: '+34 666777888',
    deliveryAddress: 'Passeig de Gràcia 92, Barcelona',
    coordinates: { lat: 41.3951, lng: 2.1642 },
    items: [{ flowerId: 'flower2', flowerName: 'Ramo Romántico', quantity: 1, price: 45 }],
    total: 45,
    status: 'confirmed',
    deliveryDate: '2025-11-28',
    deliveryTime: '11:00-12:00',
  },
];

const newOrderData: CreateOrder = {
  customerName: 'María López',
  customerEmail: 'maria@test.com',
  customerPhone: '+34 666999111',
  deliveryAddress: 'Carrer Balmes 456, Barcelona',
  deliveryDetails: 'Piso 1',
  items: [{ flowerId: 'flower3', flowerName: 'Ramo Elegante', quantity: 1, price: 55 }],
  total: 55,
  status: 'pending',
  deliveryDate: '2025-11-29',
  deliveryTime: '16:00-17:00',
  notes: 'Dejar en conserjería',
};

const updateOrderData: UpdateOrder = {
  customerName: 'Ana García Modificada',
  status: 'confirmed',
};

describe('Orders', () => {
  let service: OrdersService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/api/orders`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), OrdersService],
    });
    service = TestBed.inject(OrdersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all orders and update the orders signal', done => {
    service.getAll().subscribe(orders => {
      expect(orders).toEqual(mockOrders);
      expect(service.orders()).toEqual(mockOrders);
      done();
    });
    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toEqual('GET');
    req.flush(mockOrders);
  });

  it('should fetch a specific order by Id', done => {
    const targetId = mockOrders[0]._id;
    service.getOne(targetId).subscribe(order => {
      expect(order).toEqual(mockOrders[0]);
      done();
    });
    const req = httpMock.expectOne(`${apiUrl}/${targetId}`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockOrders[0]);
  });

  it('should create an order and add it to the orders signals', done => {
    service.getAll().subscribe();
    httpMock.expectOne(apiUrl).flush(mockOrders);

    const newOrderWithId: Order = { ...newOrderData, _id: 'order3' } as Order;

    service.create(newOrderData).subscribe(createdOrder => {
      expect(createdOrder).toEqual(newOrderWithId);
      expect(service.orders().length).toBe(mockOrders.length + 1);
      expect(service.orders()).toContain(newOrderWithId);
      done();
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newOrderData);
    req.flush(newOrderWithId);
  });

  it('should update order and reflect the changes in the signal', done => {
    service.getAll().subscribe();
    httpMock.expectOne(apiUrl).flush(mockOrders);

    const targetId = mockOrders[0]._id;
    const updatedOrder: Order = { ...mockOrders[0], ...updateOrderData } as Order;
    service.update(targetId, updateOrderData).subscribe(res => {
      expect(res.customerName).toBe('Ana García Modificada');
      expect(res.status).toBe('confirmed');

      const updatedItem = service.orders().find(o => o._id === targetId);
      expect(updatedItem?.customerName).toBe('Ana García Modificada');
      expect(updatedItem?.status).toBe('confirmed');
      expect(service.orders().length).toBe(mockOrders.length);
      done();
    });

    const req = httpMock.expectOne(`${apiUrl}/${targetId}`);
    expect(req.request.method).toBe('PATCH');
    req.flush(updatedOrder);
  });

  it('should update just STATUS order and reflect the changes in the signal', done => {
    service.getAll().subscribe();
    httpMock.expectOne(apiUrl).flush(mockOrders);

    const targetId = mockOrders[0]._id;
    const newStatus = 'delivered';
    const updatedOrder: Order = { ...mockOrders[0], status: newStatus };

    service.updateStatus(targetId, newStatus).subscribe(res => {
      expect(res.status).toBe(newStatus);

      const updatedItem = service.orders().find(o => o._id === targetId);
      expect(updatedItem?.status).toBe(newStatus);
      expect(service.orders().length).toBe(mockOrders.length);
      done();
    });

    const req = httpMock.expectOne(`${apiUrl}/${targetId}/status`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ status: newStatus });
    req.flush(updatedOrder);
  });

  it('Should delete an order and remove it from the signal', done => {
    service.getAll().subscribe();
    httpMock.expectOne(apiUrl).flush(mockOrders);

    const targetId = mockOrders[0]._id;

    service.delete(targetId).subscribe(() => {
      expect(service.orders().length).toBe(mockOrders.length - 1);

      const isDeleted = service.orders().some(o => o._id === targetId);
      expect(isDeleted).toBeFalse();
      done();
    });

    const req = httpMock.expectOne(`${apiUrl}/${targetId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});

describe('Computed Signals', () => {
  let service: OrdersService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/api/orders`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), OrdersService],
    });
    service = TestBed.inject(OrdersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should filter today orders', () => {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const ordersWithDates: Order[] = [
      { ...mockOrders[0], deliveryDate: today },
      { ...mockOrders[1], deliveryDate: tomorrowStr },
    ];

    service.getAll().subscribe();
    httpMock.expectOne(apiUrl).flush(ordersWithDates);

    const todayOrders = service.todayOrders();
    expect(todayOrders.length).toBe(1);
    expect(todayOrders[0].deliveryDate).toBe(today);
  });

  it('should filter pending orders', () => {
    service.getAll().subscribe();
    httpMock.expectOne(apiUrl).flush(mockOrders);

    const pendingOrders = service.pendingOrders();
    expect(pendingOrders.length).toBe(1);
    expect(pendingOrders[0].status).toBe('pending');
  });

  it('should calculate today total', () => {
    const today = new Date().toISOString().split('T')[0];
    const ordersToday: Order[] = [
      { ...mockOrders[0], deliveryDate: today, total: 100 },
      { ...mockOrders[1], deliveryDate: today, total: 50 },
    ];

    service.getAll().subscribe();
    httpMock.expectOne(apiUrl).flush(ordersToday);

    const total = service.todayTotal();
    expect(total).toBe(150);
  });

  it('should sort today orders by time', () => {
    const today = new Date().toISOString().split('T')[0];
    const unsortedOrders: Order[] = [
      { ...mockOrders[0], deliveryDate: today, deliveryTime: '14:00-15:00' },
      { ...mockOrders[1], deliveryDate: today, deliveryTime: '10:00-11:00' },
    ];

    service.getAll().subscribe();
    httpMock.expectOne(apiUrl).flush(unsortedOrders);

    const sorted = service.todayOrdersSorted();
    expect(sorted[0].deliveryTime).toBe('10:00-11:00');
    expect(sorted[1].deliveryTime).toBe('14:00-15:00');
  });
});
