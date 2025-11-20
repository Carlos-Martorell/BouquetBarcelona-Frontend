import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core'
import { FlowersService } from '@core/services/flowers/flowers';
import { FlowerForm } from "../../components/flower-form/flower-form";
import { FlowerFormService } from '../../services/flower-form';


@Component({
  selector: 'app-flowers-management',
  imports: [FlowerForm],
  templateUrl: './flowers-management.html',
  styleUrl: './flowers-management.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlowersManagement implements OnInit {

  flowersService = inject(FlowersService);
  formService = inject(FlowerFormService);
  
  
  isLoading = signal(false);
  errorMessage = signal<string|null>(null);

  
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
    this.formService.openForCreate()
  }

  
  openEditModal(id: string) {
    this.formService.openForEdit(id)
  }


  deleteFlower(id: string, name: string) {
    if(!confirm(`¿Está seguro que desea eliminar el ramo: ${name}?`)) return

    this.flowersService.delete(id).subscribe({
      next: () => alert('Ramo eliminado'),
      error: (err) => alert(`Error: ${err}`)
    })
  }
}
