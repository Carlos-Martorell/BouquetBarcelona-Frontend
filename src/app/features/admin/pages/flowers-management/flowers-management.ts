import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { FlowersService } from '@core/services/flowers';


@Component({
  selector: 'app-flowers-management',
  imports: [],
  templateUrl: './flowers-management.html',
  styleUrl: './flowers-management.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlowersManagement implements OnInit {

  flowersService = inject(FlowersService);
  
  //Signals
  isLoading = signal(false);
  errorMessage = signal<string|null>(null);
  isFormOpen = signal(false);
  editingFlowerId = signal<string|null>(null);
  //Computed signals
  flowerCount = computed(() => this.flowersService.flowers().length)
  hasFlowers = computed(() => this.flowerCount() > 0)


  ngOnInit() {
    this.loadFlowers();
  }

  loadFlowers() {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.flowersService.getAll().subscribe({
      next: () => this.isLoading.set(false),
      error: () => {
        this.isLoading.set(false)
        this.errorMessage.set('Error al cargar ramos')
      }}
    )
  }

  openCreateModal() {
    this.editingFlowerId.set(null);
    this.isFormOpen.set(true)
  }

    openEditModal(id: string) {
    this.editingFlowerId.set(id);
    this.isFormOpen.set(true)
  }

  closeForm() {
    this.isFormOpen.set(false)
    this.editingFlowerId.set(null);
  }

  deleteFlower(id: string, name: string) {
    if(!confirm(`¿Está seguro que desea eliminar el ramo: ${name}?`)) return

    this.flowersService.delete(id).subscribe({
      next: () => console.log('Ramo eliminado'),
      error: (err) => console.log('Error:', err)
    })
  }
}
