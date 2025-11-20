
export interface Order {
  _id: string;
  customerName: string;
  customerPhone: string;
  address: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  deliveryDate: Date;
  deliveryTime: string; // "10:00-12:00"
  coordinates?: {
    lat: number;
    lng: number;
  };
  createdAt: Date;
}

export interface OrderItem {
  flowerId: string;
  flowerName: string;
  quantity: number;
  price: number;
}