import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class OrderFormService {

  isOpen = signal(false);
  editingOrderId = signal<string | null>(null);

  openForCreate(){
    this.isOpen.set(true);
    this.editingOrderId.set(null);
  }
  openForEdit(id: string){
    this.isOpen.set(true);
    this.editingOrderId.set(id);
  }
  
  close() {
    this.isOpen.set(false);
    setTimeout(() => {
      this.editingOrderId.set(null)
    }, 300)
  }
}
