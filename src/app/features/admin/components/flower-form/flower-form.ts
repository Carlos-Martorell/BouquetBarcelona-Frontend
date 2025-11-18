import { ChangeDetectionStrategy, Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { FlowersService } from '@core/services/flowers';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { FlowerFormService } from '../../services/flower-form';

@Component({
  selector: 'app-flower-form',
  imports: [],
  templateUrl: './flower-form.html',
  styleUrl: './flower-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlowerForm implements OnInit {

  private fb = inject(FormBuilder);
  private flowersService = inject(FlowersService);
  formService = inject(FlowerFormService);

  flowerForm!: FormGroup;

  isSubmitting = signal(false);
  errorMessage = signal<string|null>(null);
  hasMinimImages = computed(() => this.imageUrlsArray.length > 3)
  
  constructor() {
    effect(() => {
      const flowerId = this.formService.editindFlowerId()

      if(flowerId){
        this.loadFlowerData(flowerId)
      } else {
        this.resetForm()
      }
    })
  }

  ngOnInit(){
    this.initForm()
  }

    
  initForm(){
    this.flowerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: ['', Validators.required],
      stock: [0, [Validators.required, Validators.min(0)]],
      imageUrls: this.fb.array([
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required),
      ])
    })
  }

  get imageUrlsArray():FormArray {
    return this.flowerForm.get('imageUrls') as FormArray
  }

  addImageUrlField () {
    if(this.imageUrlsArray.length < 10) {
      this.imageUrlsArray.push(this.fb.control('', Validators.required));
    }
  }

  removeImageUrlField(index: number) {
    if(this.imageUrlsArray.length > 3) {
      this.imageUrlsArray.removeAt(index)
    }
  }


  loadFlowerData(id: string) {
    const flower = this.flowersService.flowers().find(f => f._id === id)

    if (flower) {
      this.flowerForm.patchValue({
        name: flower.name,
        price: flower.price,
        description: flower.description,
        category: flower.category,
        stock: flower.stock,
      })
      this.imageUrlsArray.clear();
      flower.images.forEach(url => {
        this.imageUrlsArray.push(this.fb.control(url, Validators.required))
      })
      while (this.imageUrlsArray.length < 3) {
        this.imageUrlsArray.push(this.fb.control('', Validators.required))
      }
    }
  }

  resetForm() {
    this.flowerForm.reset({
      name: '',
      price: 0,
      description: '',
      category: '',
      stock: 0,
      imageUrl: ''
    })
    this.imageUrlsArray.clear();
    for(let i = 0; i < 3; i++) {
      this.imageUrlsArray.push(this.fb.control('', Validators.required))

    }
    this.errorMessage.set(null)
  }

  onSubmit() {
    if(this.flowerForm.invalid){
      this.flowerForm.markAllAsTouched()
      return
    }
    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const images = this.imageUrlsArray.value.filter((url: string) => url && url.trim());
    if(images.length < 3) {
      this.errorMessage.set('Debes añadir al menos 3 imagenes.');
      this.isSubmitting.set(false);
      return
    }
    const formData = {
      name: this.flowerForm.value.name,
      price: this.flowerForm.value.price,
      description: this.flowerForm.value.description,
      category: this.flowerForm.value.category,
      stock: this.flowerForm.value.stock,
      images: images
    };


    const flowerId = this.formService.editindFlowerId()

    if(flowerId) {
        this.flowersService.update(flowerId, formData).subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.formService.close();
        },
        error: (err) => {
          this.errorMessage.set('Error al actualizar el ramo');
          this.isSubmitting.set(false);
        }
      });
    } else {
      this.flowersService.create(formData).subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.formService.close();
        },
        error: (err) => {
          this.errorMessage.set('Error al crear el ramo');
          this.isSubmitting.set(false);
        }
      });
    }
  }

  onClose(){
    this.formService.close()
  }

  hasError(fieldName: string): boolean {
    const field = this.flowerForm.get(fieldName);
    return !!(field && field.invalid && field.touched)
  }

  hasErrorInArray(index: number): boolean {
    const control = this.imageUrlsArray.at(index);
    return !!(control && control.invalid && control.touched)
  }

  getError(fieldName: string): string {
    const field = this.flowerForm.get(fieldName);

    if(!field?.errors) return '';
    if (field.errors['required']) return 'Este campo es obligatorio';
    if (field.errors['minlength']) return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
    if (field.errors['min']) return `El valor mínimo es ${field.errors['min'].min}`;
    
    return 'Campo inválido';
  }



}