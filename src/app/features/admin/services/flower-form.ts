import { computed, inject, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FlowerFormService {

  private isFormOpenSignal = signal(false);
  private editingFlowerIdSignal = signal<string|null>(null);
  readonly isFormOpen = this.isFormOpenSignal.asReadonly()
  readonly editindFlowerId = this.editingFlowerIdSignal.asReadonly()

  readonly isEditing = computed(() => this.editindFlowerId() !== null)
  readonly isCreating = computed(() => this.editindFlowerId() == null)

  readonly modalTitle = computed(() => this.isEditing()?'Editar ramo': 'Crear nuevo ramo');
  readonly submitButtonText = computed(() => this.isEditing()?'Actualizar ramo':'Crear ramo')

  openForCreate() {
    this.isFormOpenSignal.set(true);
    this.editingFlowerIdSignal.set(null);
  }
  openForEdit(id: string) {
    this.isFormOpenSignal.set(true);
    this.editingFlowerIdSignal.set(id);
  }

  close() {
    this.isFormOpenSignal.set(false);
    this.editingFlowerIdSignal.set(null);
  }
  
}
