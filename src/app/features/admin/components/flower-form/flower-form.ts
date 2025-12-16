import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FlowersService } from '@core/services/flowers/flowers';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormArray,
  FormControl,
} from '@angular/forms';
import { FlowerFormService } from '@serv-admin/flower-form/flower-form';
import { TrashIcon } from "@shared/components/trash-icon/trash-icon";

@Component({
  selector: 'app-flower-form',
  imports: [ReactiveFormsModule, TrashIcon],
  templateUrl: './flower-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlowerForm implements OnInit {
  private fb = inject(FormBuilder);
  private flowersService = inject(FlowersService);
  formService = inject(FlowerFormService);

  flowerForm!: FormGroup;

  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);
  hasMinimImages = computed(() => this.imageUrlsArray.length >= 3);

  readonly categories = [
    'romántico',
    'mediterráneo',
    'botánico',
    'silvestre',
    'moderno'
  ];

  readonly sizes = ['pequeño', 'mediano', 'grande'];

  readonly occasions = [
    'Amor',
    'Cumpleaños',
    'Cacimiento',
    'Agradecimiento',
    'Pésame',
    'Celebración'
  ];

  constructor() {
    effect(() => {
      const flowerId = this.formService.editindFlowerId();

      if (flowerId) {
        this.loadFlowerData(flowerId);
      } else {
        this.resetForm();
      }
    });
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.flowerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      price: ['', [Validators.required, Validators.min(0.01)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: ['', Validators.required],
      stock: ['', [Validators.required, Validators.min(0)]],
      imageUrls: this.fb.array([
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required),
      ]),
      size: ['mediano', Validators.required],
      colors: this.fb.array([this.fb.control('', Validators.required)]), 
      occasion: ['amor', Validators.required],
      careInstructions: ['']
      
    });
  }

  get imageUrlsArray(): FormArray<FormControl<string | null>> {
    return this.flowerForm.get('imageUrls') as FormArray<FormControl<string | null>>;
  }

  addImageUrlField() {
    if (this.imageUrlsArray.length < 10) {
      this.imageUrlsArray.push(this.fb.control('', Validators.required));
    }
  }

  removeImageUrlField(index: number) {
    if (this.imageUrlsArray.length > 3) {
      this.imageUrlsArray.removeAt(index);
    }
  }

  get colorsArray(): FormArray<FormControl<string | null>> {
    return this.flowerForm.get('colors') as FormArray<FormControl<string | null>>;
  }

  addColorField() {
    this.colorsArray.push(this.fb.control('', Validators.required));
  }

  removeColorField(index: number) {
    if (this.colorsArray.length > 1) {
      this.colorsArray.removeAt(index);
    }
    else if (this.colorsArray.length === 1) {
      const control = this.colorsArray.at(0); 
      control.setValue('');
      control.markAsUntouched(); 
    }
  }

  loadFlowerData(id: string) {
    const flower = this.flowersService.flowers().find(f => f._id === id);

    if (flower) {
      this.flowerForm.patchValue({
        name: flower.name,
        price: flower.price,
        description: flower.description,
        category: flower.category,
        stock: flower.stock,
        size: flower.size,
        occasion: flower.occasion,
        careInstructions: flower.careInstructions
      });
      this.imageUrlsArray.clear();
      flower.images.forEach(url => {
        this.imageUrlsArray.push(this.fb.control(url, Validators.required));
      });
      while (this.imageUrlsArray.length < 3) {
        this.imageUrlsArray.push(this.fb.control('', Validators.required));
      }
      this.colorsArray.clear();
      flower.colors.forEach(color => {
        this.colorsArray.push(this.fb.control(color, Validators.required));
      });
      if (this.colorsArray.length === 0) {
        this.colorsArray.push(this.fb.control('', Validators.required));
      }
    }
  }

  resetForm() {
    if (!this.flowerForm) return;

    this.flowerForm.reset({
      name: '',
      price: '',
      description: '',
      category: '',
      stock: '',
      size: '',
      occasion: '',
      careInstructions: '',
    });
    this.imageUrlsArray.clear();
    this.colorsArray.clear();
    for (let i = 0; i < 3; i++) {
      this.imageUrlsArray.push(this.fb.control('', Validators.required));
    }
    this.colorsArray.push(this.fb.control('', Validators.required));
    this.errorMessage.set(null);
  }

  onSubmit() {
    if (this.flowerForm.invalid) {
      this.flowerForm.markAllAsTouched();
      return;
    }
    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const images = this.imageUrlsArray.value.filter(
      (url): url is string => url !== null && url.trim() !== ''
    );
    const colors = this.colorsArray.value.filter(
    (color): color is string => color !== null && color.trim() !== ''
    );
    if (images.length < 3) {
      this.errorMessage.set('Debes añadir al menos 3 imagenes.');
      this.isSubmitting.set(false);
      return;
    }
    if (colors.length === 0) {
      this.errorMessage.set('Debes añadir al menos 1 color.');
      this.isSubmitting.set(false);
    return;
    }
    const formData = {
      name: this.flowerForm.value.name,
      price: this.flowerForm.value.price,
      description: this.flowerForm.value.description,
      category: this.flowerForm.value.category,
      stock: this.flowerForm.value.stock,
      images: images,
      size: this.flowerForm.value.size,
      colors: colors,
      occasion: this.flowerForm.value.occasion,
      careInstructions: this.flowerForm.value.careInstructions || undefined
    };

    const flowerId = this.formService.editindFlowerId();

    if (flowerId) {
      this.flowersService.update(flowerId, formData).subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.formService.close();
        },
        error: err => {
          this.errorMessage.set('Error al actualizar el ramo');
          this.isSubmitting.set(false);
        },
      });
    } else {
      this.flowersService.create(formData).subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.resetForm();
          this.formService.close();
        },
        error: err => {
          this.errorMessage.set('Error al crear el ramo');
          this.isSubmitting.set(false);
        },
      });
    }
  }

  onClose() {
    this.formService.close();
  }

  hasError(fieldName: string): boolean {
    const field = this.flowerForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  hasErrorInArray(index: number): boolean {
    const control = this.imageUrlsArray.at(index);
    return !!(control && control.invalid && control.touched);
  }

  getError(fieldName: string): string {
    const field = this.flowerForm.get(fieldName);

    if (!field?.errors) return '';
    if (field.errors['required']) return 'Este campo es obligatorio';
    if (field.errors['minlength'])
      return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
    if (field.errors['min']) return `El valor mínimo es ${field.errors['min'].min}`;

    return 'Campo inválido';
  }
}
