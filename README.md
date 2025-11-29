
# 🌸 Bouquet Barcelona - Frontend

Modern e-commerce florist application built with **Angular 20**, following best practices with **Signals**, **Standalone Components**, and **Lazy Loading**.

---

## 🚀 Live Demo

- **Frontend:** [https://bouquet-barcelona-frontend.vercel.app](https://bouquet-barcelona-frontend.vercel.app)
- **Backend API:** [https://bouquetbarcelona-backend.onrender.com](https://bouquetbarcelona-backend.onrender.com)

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Angular** | 20 | Main framework with Signals |
| **TypeScript** | 5.x | Typed superset of JavaScript |
| **Tailwind CSS** | 4.x | Utility-first styling |
| **DaisyUI** | Latest | Tailwind component library |
| **FullCalendar** | 6.x | Interactive order calendar |
| **Mapbox GL** | Latest | Delivery locations map |
| **Chart.js** | Latest | Analytics charts |
| **Jasmine/Karma** | - | Unit testing framework |
| **Vercel** | - | Frontend hosting |

---

## 📁 Project Architecture
```
src/app/
├── core/
│   ├── models/              # TypeScript interfaces
│   │   ├── flower.ts        # Flower, CreateFlower, UpdateFlower
│   │   └── order.ts         # Order, CreateOrder, UpdateOrder
│   └── services/            # Global services with Signals
│       ├── flowers/         # FlowersService (CRUD + signals)
│       ├── order/           # OrdersService (CRUD + computed signals)
│       ├── geocoding/       # Mapbox address autocomplete
│       └── notification/    # Toast notifications
│
├── features/
│   └── admin/
│       ├── layouts/
│       │   └── admin-layout/      # Sidebar navigation layout
│       ├── pages/
│       │   ├── dashboard/         # Summary widgets + mini calendar
│       │   ├── flowers-management/# Flowers CRUD table
│       │   ├── orders-management/ # Orders CRUD with filters
│       │   ├── calendar/          # FullCalendar view
│       │   ├── maps/              # Mapbox delivery locations
│       │   └── analytics/         # Chart.js reports
│       ├── components/
│       │   ├── flower-form/       # Create/edit flower modal
│       │   ├── order-form/        # Create/edit order modal
│       │   └── mini-map/          # Dashboard map widget
│       └── services/
│           ├── flower-form/       # Flower modal state
│           └── order-form/        # Order modal state
│
├── shared/                  # Reusable components (future)
└── environments/            # API URLs + Mapbox token
```

---

## 🎯 Features Implemented

### ✅ Complete Admin Panel

#### **1. Flowers CRUD**
- List all flowers with stock indicators
- Create new flower (name, price, description, category, images, stock)
- Edit existing flower (reactive forms with validation)
- Delete flower (with confirmation)
- Image gallery (dynamic FormArray for multiple URLs)

#### **2. Orders CRUD**
- List all orders with filters (status, search by name/email/address)
- Create manual order (admin creates for phone orders)
- Edit order (all fields editable)
- Quick status updates (Pending → Confirmed → Delivered)
- Delete order (with confirmation)

**Order Form Features:**
- Customer details (name, phone, email)
- Delivery address with **Mapbox autocomplete**
- Delivery details (floor, door, etc.)
- Date picker (blocks past dates)
- Time slots dropdown (9:00-19:00)
- Dynamic product selector (add/remove items)
- **Real-time total calculation**
- Optional notes field

#### **3. Interactive Calendar (FullCalendar)**
- Month/week/day views
- Orders displayed as events
- Color-coded by status (pending/confirmed/delivered)
- Click event to view order details
- Today's deliveries sidebar
- Delivery time ranges

#### **4. Delivery Map (Mapbox GL)**
- Workshop location (fixed black marker)
- Today's delivery locations (green markers)
- Interactive popups with order details
- Auto-fit bounds to show all markers
- Zoom/pan controls
- Fullscreen mode

#### **5. Analytics Dashboard (Chart.js)**
- **Weekly stats:** Revenue + order count
- **Monthly stats:** Revenue + order count
- **Line chart:** Sales trend (last 7 days)
- **Doughnut chart:** Orders by status distribution
- **Bar chart:** Top 5 best-selling products
- Real-time updates from orders signal

#### **6. Dashboard Overview**
- Today's delivery schedule (sorted by time)
- Next deliveries details (products + notes)
- Inventory status (stock warnings)

---

## 🧠 Advanced Patterns & Architecture

### **1. Signals-First Architecture**
```typescript
// OrdersService - Reactive state without RxJS for UI
private ordersSignal = signal<Order[]>([]);
readonly orders = this.ordersSignal.asReadonly();

// Computed signals for derived state
readonly todayOrders = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return this.orders().filter(order => {
    const orderDate = new Date(order.deliveryDate);
    orderDate.setHours(0, 0, 0, 0);
    return orderDate.getTime() === today.getTime();
  });
});

readonly todayTotal = computed(() =>
  this.todayOrders().reduce((sum, o) => sum + o.total, 0)
);

readonly pendingOrders = computed(() =>
  this.orders().filter(o => o.status === 'pending')
);
```

**Why Signals?**
- **Synchronous:** No async pipe needed in templates
- **Automatic change detection:** Angular tracks dependencies
- **Better performance:** Fine-grained reactivity
- **Simpler code:** `todayOrders()` instead of `todayOrders$ | async`

---

### **2. Hybrid Reactive Forms + Signals**

**Problem:** FormArray changes don't trigger computed signals.

**Solution:** Bridge with RxJS `valueChanges`:
```typescript
// order-form.component.ts
totalSignal = signal(0);

ngAfterViewInit() {
  this.itemsArray.valueChanges.subscribe(() => {
    this.updateTotal();
  });
}

private updateTotal(): void {
  const total = this.itemsArray.value.reduce(
    (sum, item) => sum + (item.price * item.quantity),
    0
  );
  this.totalSignal.set(total);
}
```

**Key insight:** Combine Angular's reactive tools:
- **FormArray** → Form structure & validation
- **valueChanges** → Observable stream
- **Signal** → Reactive UI state

---

### **3. Service-Based State Management**

No `@Input`/`@Output` between components. Instead:
```typescript
// Shared service pattern
@Injectable({ providedIn: 'root' })
export class OrderFormService {
  isOpen = signal(false);
  editingOrderId = signal<string | null>(null);

  openForCreate() {
    this.editingOrderId.set(null);
    this.isOpen.set(true);
  }

  openForEdit(id: string) {
    this.editingOrderId.set(id);
    this.isOpen.set(true);
  }
}
```

**Benefits:**
- Single source of truth
- No prop drilling
- Easy to test

---

### **4. Lazy Loading with Standalone Components**
```typescript
// app.routes.ts
{
  path: 'admin/analytics',
  loadComponent: () => import('./features/admin/pages/analytics/analytics')
    .then(m => m.Analytics)
}
```

**Performance:**
- Code-splitting by route
- Only download JS when navigating
- Faster initial load

---

## 🎨 Design System

### **Color Palette** (Tailwind @theme)
```css
--color-text: #2d3748;        /* Charcoal - main text */
--color-background: #f7fafc;  /* Ice gray - page bg */
--color-primary: #744c3e;     /* French chocolate - brand */
--color-secondary: #c9a689;   /* Sand - accents */
--color-accent: #d4a5a5;      /* Old rose - highlights */
--color-success: #8fa998;     /* Sage - success states */
--color-error: #b85450;       /* Soft burgundy - errors */
--color-border: #e8e3df;      /* Parchment - dividers */
```

### **Component Library**

- **DaisyUI** for form controls, buttons, badges
- **Tailwind utilities** for layout, spacing, colors
- **Custom components** for domain-specific UI

---

## 🗺️ Key Integrations

### **Mapbox**
```typescript
// Autocomplete addresses
async searchAddresses(query: string): Promise<AddressSuggestion[]> {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${token}&country=ES`;
  const response = await fetch(url);
  return response.json().features;
}
```

**Backend geocoding:**
```typescript
// orders.service.ts (NestJS)
async create(dto: CreateOrderDto): Promise<Order> {
  dto.coordinates = await this.geocodeAddress(dto.deliveryAddress);
  return this.orderModel.create(dto);
}
```

---

## 🧪 Testing Strategy

### **Unit Tests (Jasmine/Karma)**
```bash
npm test
```

**Coverage:**
- ✅ FlowersService (CRUD + signals)
- ✅ OrdersService (CRUD + computed signals)
- ✅ Computed signals (filters, calculations)

**Test Pattern:**
```typescript
it('should update order and reflect changes in signal', (done) => {
  // ARRANGE: Load initial data
  service.getAll().subscribe();
  httpMock.expectOne(apiUrl).flush(mockOrders);

  // ACT: Update order
  service.update(id, data).subscribe((updated) => {
    // ASSERT: Verify signal updated
    const orderInSignal = service.orders().find(o => o._id === id);
    expect(orderInSignal?.status).toBe('confirmed');
    done();
  });

  // Simulate backend response
  httpMock.expectOne(`${apiUrl}/${id}`).flush(updatedOrder);
});
```

---

## 🚀 Installation & Development
```bash
# Clone repository
git clone https://github.com/Carlos-Martorell/bouquet-barcelona-frontend.git
cd bouquet-barcelona-frontend

# Install dependencies
npm install

# Development server (http://localhost:4200)
ng serve

# Production build
ng build --configuration=production

# Run tests
ng test

# Lint & format
npm run format
npm run format:check
```

### **Environment Setup**

Create `src/environments/environments.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  mapboxKey: 'pk.ey...' // Get from mapbox.com
};
```

---

## 📊 Backend Integration (NestJS)

**Technologies:**
- NestJS framework
- MongoDB with Mongoose
- Class-validator for DTOs
- node-fetch for Mapbox API

**Key endpoints:**
```
GET    /api/flowers
POST   /api/flowers
PATCH  /api/flowers/:id
DELETE /api/flowers/:id

GET    /api/orders
POST   /api/orders          # Auto-geocodes address
PATCH  /api/orders/:id
PATCH  /api/orders/:id/status
DELETE /api/orders/:id
```

**Automatic Geocoding:**
```typescript
private async geocodeAddress(address: string) {
  const response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${token}`
  );
  const [lng, lat] = data.features[0].center;
  return { lat, lng };
}
```

---

## 🎓 Key Learnings

### **1. When to use Signals vs Observables**

| Use Case | Tool | Why |
|----------|------|-----|
| HTTP requests | Observable | Async, cancellable |
| UI state | Signal | Sync, automatic tracking |
| Form changes | Observable | Built into Angular forms |
| Derived state | Computed | Auto-recalculates |

### **2. FormArray with TypeScript**
```typescript
// Type-safe FormArray access
get imageUrlsArray(): FormArray<FormControl<string | null>> {
  return this.form.get('imageUrls') as FormArray<FormControl<string | null>>;
}

// Filter nulls with type guard
const images = this.imageUrlsArray.value
  .filter((url): url is string => url !== null && url.trim() !== '');
```

### **3. Sharing state between components**

**Pattern:** Injectable service with signals
```typescript
@Injectable({ providedIn: 'root' })
export class StateService {
  private dataSignal = signal<Data[]>([]);
  readonly data = this.dataSignal.asReadonly();
  
  update(newData: Data[]) {
    this.dataSignal.set(newData);
  }
}
```

**Components:** Inject and read
```typescript
export class MyComponent {
  stateService = inject(StateService);
  items = computed(() => this.stateService.data());
}
```

---

## 🗺️ Roadmap

### **Sprint 9 (Next):**
- [ ] User authentication (JWT)
- [ ] User shopping cart
- [ ] Public product catalog
- [ ] Checkout flow
- [ ] Order tracking

### **Future Features:**
- [ ] Email notifications
- [ ] Payment integration (Stripe)
- [ ] Invoice generation
- [ ] Multi-language support (i18n)
- [ ] Progressive Web App (PWA)

---

## 👤 Author

**Carlos Martorell**
- GitHub: [@Carlos-Martorell](https://github.com/Carlos-Martorell)
- LinkedIn: [Carlos Martorell Otal](https://www.linkedin.com/in/carlos-martorell-otal)

---

## 📄 License

This project is licensed under the MIT License.

---
