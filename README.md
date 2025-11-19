# 🌸 Bouquet Barcelona - Frontend

E-commerce florist application built with Angular 20, following modern best practices with Signals, Standalone Components, and Lazy Loading.

## 🚀 Demo

- **Frontend:** [[https://bouquet-barcelona.vercel.app](https://bouquet-barcelona-frontend.vercel.app)]
- **Backend API:** [[https://bouquet-api.onrender.com](https://bouquetbarcelona-backend.onrender.com/)]

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Angular | 20 | Main framework |
| TypeScript | 5.x | Typed language |
| Tailwind CSS | 4.x | Utility-first styling |
| Jasmine/Karma | - | Unit testing |
| Vercel | - | Frontend deployment |

## 📁 Project Structure
```
src/app/
├── core/                    # Global services and models
│   ├── models/
│   │   └── flower.ts        # Flower, CreateFlower, UpdateFlower interfaces
│   └── services/
│       └── flowers.ts       # FlowersService with signals and HTTP
├── features/
│   └── admin/
│       ├── pages/
│       │   └── flowers-management/  # Flowers CRUD page
│       ├── components/
│       │   └── flower-form/         # Create/edit modal
│       └── services/
│           └── flower-form.ts       # Modal state management
├── shared/                  # Reusable components
└── environments/            # Environment configuration
```

## 🎯 Implemented Features

### Complete Flowers CRUD
- ✅ List all flowers (GET)
- ✅ View flower details (GET by ID)
- ✅ Create new flower (POST)
- ✅ Edit existing flower (PATCH)
- ✅ Delete flower (DELETE)

### Signals Architecture
```typescript
// Reactive state without RxJS for UI
flowersSignal = signal<Flower[]>([]);
flowers = flowersSignal.asReadonly();

// Computed values
flowerCount = computed(() => this.flowers().length);
hasFlowers = computed(() => this.flowerCount() > 0);
```

### Reactive Forms
- FormGroup with validations (required, minLength, min)
- Dynamic FormArray for multiple image URLs
- Type guards for TypeScript type safety

### Lazy Loading Routing
```typescript
// Deferred component loading
{
  path: 'admin/flowers',
  loadComponent: () => import('./features/admin/pages/flowers-management/flowers-management')
    .then(m => m.FlowersManagement)
}
```

## 🎨 Design System

### Color Palette (@theme)
```css
--color-text: #2d3748;        /* Charcoal */
--color-background: #f7fafc;  /* Ice gray */
--color-primary: #744c3e;     /* French chocolate */
--color-secondary: #c9a689;   /* Sand */
--color-accent: #d4a5a5;      /* Old rose */
--color-success: #8fa998;     /* Sage */
--color-error: #b85450;       /* Soft burgundy */
--color-border: #e8e3df;      /* Parchment */
```

## 🧪 Testing

Unit tests for FlowersService with Jasmine/Karma:
```bash
ng test
```

### Implemented Tests:
- ✅ Service creation
- ✅ getAll() updates signal
- ✅ getOne() fetches flower by ID
- ✅ create() adds to signal
- ✅ update() modifies in signal
- ✅ delete() removes from signal

## 🚀 Installation & Running
```bash
# Clone repository
git clone https://github.com/your-username/bouquet-barcelona-frontend.git

# Install dependencies
npm install

# Development (localhost:4200)
ng serve

# Production build
ng build --configuration=production

# Run tests
ng test
```


## 📚 Key Concepts Learned

### Signals vs Observables
- **Signals:** Synchronous and reactive state for UI
- **Observables:** Asynchronous operations (HTTP)

### Component Communication
- **Shared service:** FlowerFormService as single source of truth
- **No @Input/@Output:** Components read directly from service

### Type Safety with FormArray
```typescript
get imageUrlsArray(): FormArray<FormControl<string | null>> {
  return this.flowerForm.get('imageUrls') as FormArray<FormControl<string | null>>;
}

// Type guard to filter nulls
const images = this.imageUrlsArray.value
  .filter((url): url is string => url !== null && url.trim() !== '');
```

## 🗺️ Roadmap

- [ ] Dashboard with order calendar
- [ ] Sales charts (Chart.js)
- [ ] Delivery map (Leaflet)
- [ ] JWT Authentication
- [ ] Shopping cart (client side)

## 👤 Author

**Carlos Martorell**
- GitHub: [@your-username](https://github.com/your-username)
- LinkedIn: [your-profile](https://linkedin.com/in/your-profile)

## 📄 License

This project is under the MIT License.
