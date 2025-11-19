import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { CreateFlower, Flower, UpdateFlower } from '../models/flower';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class FlowersService {

private readonly apiUrlLC = 'http://localhost:3000/api/flowers'
private readonly apiUrl = `${environment.apiUrl}/flowers`;

private flowersSignal = signal<Flower[]> ([])

readonly flowers = this.flowersSignal.asReadonly()

constructor(private http:HttpClient) {}

getAll(): Observable<Flower[]> { 
  return this.http.get<Flower[]>(this.apiUrl).pipe(
    tap(flowers => this.flowersSignal.set(flowers))
  )
}
  
getOne(id: string): Observable<Flower>{
  return this.http.get<Flower>(`${this.apiUrl}/${id}`)
}

create(flower: CreateFlower): Observable<Flower>{
  return this.http.post<Flower>(this.apiUrl, flower).pipe(
    tap(newFlower => this.flowersSignal.update(flowers => [...flowers, newFlower]))
  )
}

update(id: string, flower: UpdateFlower): Observable<Flower>{
  return this.http.patch<Flower>(`${this.apiUrl}/${id}`, flower).pipe(
    tap(updateFlower => this.flowersSignal.update(flowers => flowers.map(
      f => f._id === id ? updateFlower : f
    )))
  )
}

delete(id: string): Observable<void>{
  return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
    tap(() =>
      this.flowersSignal.update(flower => flower.filter(f => f._id !== id))
    )
  )}

}
