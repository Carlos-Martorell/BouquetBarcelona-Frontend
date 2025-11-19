import { TestBed } from '@angular/core/testing';
import {HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import {  FlowersService } from './flowers';
import { CreateFlower, Flower, UpdateFlower } from '@core/models/flower';
import { provideHttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environments';

const mockFlowers: Flower[] =  [
  { _id: 'a1', name: 'Ramo de Lujo', price: 100, stock: 5, category: 'premium', description: 'desc1', images: ['url1'] },
  { _id: 'b2', name: 'Ramo Clásico', price: 50, stock: 10, category: 'clásico', description: 'desc2', images: ['url2'] },
];

const newFlowerData: CreateFlower = {
  name: 'Nuevo Ramo', price: 75, stock: 20, category: 'clásico', description: 'nueva desc', images: ['url3']
};

const updateFlowerData: UpdateFlower = {
  name: 'Ramo Actualizado', price: 110, category: 'premium'
};


describe('Flowers', () => {
  let service: FlowersService;
  let httpTestingController: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/api/flowers`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ provideHttpClient(), provideHttpClientTesting(), FlowersService]
    });
    service = TestBed.inject(FlowersService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify()
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all flowers and update the flowers signal', (done) => {
    service.getAll().subscribe((flowers) => {
      expect(flowers).toEqual(mockFlowers)
      expect(service.flowers()).toEqual(mockFlowers)
      done()
    })
    const req = httpTestingController.expectOne(apiUrl);
    expect(req.request.method).toEqual('GET')
    req.flush(mockFlowers)
  })

  it('should fetch a specific flower by Id', (done) => {
    const targetId = mockFlowers[0]._id
    service.getOne(targetId).subscribe((flower) => {
      expect(flower).toEqual(mockFlowers[0]);
      done()
    })
    const req = httpTestingController.expectOne(`${apiUrl}/${targetId}`)
    expect(req.request.method).toEqual('GET')
    req.flush(mockFlowers[0])
  })

  it('should create a flower and add it to the flowers signals', (done) => {
    service.getAll().subscribe()
    httpTestingController.expectOne(apiUrl).flush(mockFlowers)

    const newFlowerWithId: Flower = { ...newFlowerData, _id: 'C3' } as Flower;

    service.create(newFlowerData).subscribe((createdFlower) => {
      expect(createdFlower).toEqual(newFlowerWithId);
      expect(service.flowers().length).toBe(mockFlowers.length + 1)
      expect(service.flowers()).toContain(newFlowerWithId)
      done()
    })
    const req = httpTestingController.expectOne(apiUrl)
    expect(req.request.method).toEqual('POST')
    expect(req.request.body).toEqual(newFlowerData)
    req.flush(newFlowerWithId)
  })
  
  it('should update flowers and reflect the changes in the signal', (done) => {
    service.getAll().subscribe()
    httpTestingController.expectOne(apiUrl).flush(mockFlowers)

    const targetId = mockFlowers[0]._id
    const updatedFlower: Flower = {...mockFlowers[0], ...updateFlowerData} as Flower

    service.update(targetId, updateFlowerData).subscribe((res) => {
      expect(res.name).toBe('Ramo Actualizado')
      const updatedItem = service.flowers().find(f => f._id === targetId)
      expect(updatedItem?.name).toBe('Ramo Actualizado')
      expect(service.flowers().length).toBe(mockFlowers.length)
      done()
    })
    const req = httpTestingController.expectOne(`${apiUrl}/${targetId}`)
    expect(req.request.method).toEqual('PATCH')
    req.flush(updatedFlower)
  })

  it('Should delete a flower and remove it from the signal', (done) => {
    service.getAll().subscribe()
    httpTestingController.expectOne(apiUrl).flush(mockFlowers)

    const targetId = mockFlowers[0]._id

    service.delete(targetId).subscribe(() => {
      expect(service.flowers().length).toBe(mockFlowers.length-1)
      const isDeleted = service.flowers().some(f=> f._id === targetId)
      expect(isDeleted).toBeFalse()
      done()
    })
    const req = httpTestingController.expectOne(`${apiUrl}/${targetId}`)
    expect(req.request.method).toEqual('DELETE')
    req.flush(null)
  })

});
