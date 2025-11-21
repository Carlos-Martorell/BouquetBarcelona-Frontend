// src/app/core/models/order.ts
export interface Order {
  _id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryAddress: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  deliveryDate: string; // ISO string
  deliveryTime: string; // "10:00-12:00"
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderItem {
  flowerId: string;
  flowerName: string;
  quantity: number;
  price: number;
}

export interface CreateOrder {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryAddress: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  items: OrderItem[];
  total: number;
  status?: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  deliveryDate: string;
  deliveryTime: string;
  notes?: string;
}

export interface UpdateOrder {
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  deliveryAddress?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  items?: OrderItem[];
  total?: number;
  status?: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  deliveryDate?: string;
  deliveryTime?: string;
  notes?: string;
}